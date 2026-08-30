import { BENCHMARK_QUERIES } from './benchmark-data';
import { executeSearch } from '../lib/search/search-service';
import { RetrievalMetrics } from '../lib/types';

/**
 * Calculates Information Retrieval metrics on ground-truth benchmark dataset:
 * - Precision@5
 * - Recall@10
 * - Mean Reciprocal Rank (MRR)
 * - Normalized Discounted Cumulative Gain @ 10 (NDCG@10)
 * - Verified Scene Precision
 */
export async function runSearchRetrievalBenchmark(): Promise<RetrievalMetrics> {
  console.log('\n=============================================================');
  console.log('       SceneFind Information Retrieval Quality Benchmark       ');
  console.log(`       Evaluating ${BENCHMARK_QUERIES.length} Human-Reviewed Ground Truth Queries       `);
  console.log('=============================================================\n');

  let totalReciprocalRank = 0;
  let totalPrecisionAt5 = 0;
  let totalRecallAt10 = 0;
  let totalNDCG10 = 0;
  let totalVerifiedSceneCorrect = 0;
  let totalVerifiedSceneQueries = 0;

  const categoryStats: Record<string, { p5Sum: number; rrSum: number; count: number }> = {};

  for (const item of BENCHMARK_QUERIES) {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = { p5Sum: 0, rrSum: 0, count: 0 };
    }
    categoryStats[item.category].count++;

    const response = await executeSearch(item.query, 'all');
    const top10 = response.results.slice(0, 10);
    const top5 = response.results.slice(0, 5);

    // 1. Check Reciprocal Rank (Rank of first relevant item)
    let firstRelevantRank = 0;
    for (let rank = 1; rank <= top10.length; rank++) {
      const result = top10[rank - 1];
      const isRelevant = item.relevantTitles.some(t => t.toLowerCase() === result.mediaTitle.toLowerCase()) ||
        (item.relevantCharacters && item.relevantCharacters.some(c => result.characterName?.toLowerCase().includes(c.toLowerCase())));

      if (isRelevant) {
        firstRelevantRank = rank;
        break;
      }
    }

    const reciprocalRank = firstRelevantRank > 0 ? 1.0 / firstRelevantRank : 0;
    totalReciprocalRank += reciprocalRank;
    categoryStats[item.category].rrSum += reciprocalRank;

    // 2. Precision @ 5
    const relevantCountInTop5 = top5.filter(r => 
      item.relevantTitles.some(t => t.toLowerCase() === r.mediaTitle.toLowerCase()) ||
      (item.relevantCharacters && item.relevantCharacters.some(c => r.characterName?.toLowerCase().includes(c.toLowerCase())))
    ).length;

    const p5 = relevantCountInTop5 / 5.0;
    totalPrecisionAt5 += p5;
    categoryStats[item.category].p5Sum += p5;

    // 3. Recall @ 10
    const relevantFoundInTop10 = top10.some(r =>
      item.relevantTitles.some(t => t.toLowerCase() === r.mediaTitle.toLowerCase())
    );
    const recall = relevantFoundInTop10 ? 1.0 : 0.0;
    totalRecallAt10 += recall;

    // 4. NDCG @ 10
    let dcg = 0;
    let idcg = 0;
    for (let i = 0; i < top10.length; i++) {
      const r = top10[i];
      const isRel = item.relevantTitles.some(t => t.toLowerCase() === r.mediaTitle.toLowerCase()) ? 1 : 0;
      if (isRel) {
        dcg += (Math.pow(2, isRel) - 1) / Math.log2(i + 2);
      }
    }
    // Ideal DCG for 1 relevant target
    idcg = (Math.pow(2, 1) - 1) / Math.log2(1 + 1);
    const ndcg = idcg > 0 ? dcg / idcg : 0;
    totalNDCG10 += Math.min(1.0, ndcg);

    // 5. Verified Scene Calibration
    if (item.mustVerifyScene) {
      totalVerifiedSceneQueries++;
      const topMatch = top10[0];
      if (topMatch && topMatch.matchType === 'verified_scene' && item.relevantTitles.includes(topMatch.mediaTitle)) {
        totalVerifiedSceneCorrect++;
      }
    }
  }

  const N = BENCHMARK_QUERIES.length;
  const metrics: RetrievalMetrics = {
    totalQueries: N,
    precisionAt5: Number((totalPrecisionAt5 / N).toFixed(4)),
    recallAt10: Number((totalRecallAt10 / N).toFixed(4)),
    mrr: Number((totalReciprocalRank / N).toFixed(4)),
    ndcgAt10: Number((totalNDCG10 / N).toFixed(4)),
    verifiedScenePrecision: totalVerifiedSceneQueries > 0 
      ? Number((totalVerifiedSceneCorrect / totalVerifiedSceneQueries).toFixed(4)) 
      : 1.0,
    categoryScores: {},
  };

  for (const [cat, stats] of Object.entries(categoryStats)) {
    metrics.categoryScores[cat] = {
      p5: Number((stats.p5Sum / stats.count).toFixed(3)),
      mrr: Number((stats.rrSum / stats.count).toFixed(3)),
      count: stats.count,
    };
  }

  console.log('-------------------------------------------------------------');
  console.log('                   RETRIEVAL QUALITY METRICS                 ');
  console.log('-------------------------------------------------------------');
  console.log(`  🎯 Precision@5:              ${(metrics.precisionAt5 * 100).toFixed(1)}%`);
  console.log(`  🔍 Recall@10:                 ${(metrics.recallAt10 * 100).toFixed(1)}%`);
  console.log(`  🥇 Mean Reciprocal Rank (MRR): ${metrics.mrr}`);
  console.log(`  📊 NDCG@10:                   ${metrics.ndcgAt10}`);
  console.log(`  🛡️  Verified Scene Precision:   ${(metrics.verifiedScenePrecision * 100).toFixed(1)}%`);
  console.log('-------------------------------------------------------------');
  console.log('CATEGORY BREAKDOWN:');
  for (const [cat, score] of Object.entries(metrics.categoryScores)) {
    console.log(`  • ${cat.padEnd(16)} (n=${score.count}): MRR = ${score.mrr.toFixed(3)}, P@5 = ${(score.p5 * 100).toFixed(1)}%`);
  }
  console.log('=============================================================\n');

  return metrics;
}

if (require.main === module || process.argv[1]?.includes('benchmark')) {
  runSearchRetrievalBenchmark().then(() => {
    process.exit(0);
  });
}
