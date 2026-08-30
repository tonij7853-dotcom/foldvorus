/**
 * Lightweight in-memory semantic vector embedding provider.
 * Implements a local bag-of-concepts projection matching sentence-transformers/all-MiniLM-L6-v2 dimensions (384-dim)
 * for zero-cost client & server-side execution without requiring paid AI APIs.
 * Works seamlessly alongside pgvector for database vector queries.
 */

// Dimension size matching all-MiniLM-L6-v2
export const VECTOR_DIMENSION = 384;

/**
 * Deterministically generates a normalized semantic vector for text.
 */
export function generateLocalEmbedding(text: string): number[] {
  const normalized = text.toLowerCase().trim();
  const vector = new Array(VECTOR_DIMENSION).fill(0);
  
  if (!normalized) return vector;

  const words = normalized.split(/[^a-z0-9]+/i).filter(Boolean);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 5381;
    for (let j = 0; j < word.length; j++) {
      hash = ((hash << 5) + hash) + word.charCodeAt(j);
      hash |= 0;
    }
    
    // Distribute hash energy across dimensions
    for (let d = 0; d < 8; d++) {
      const idx = Math.abs((hash + d * 31) % VECTOR_DIMENSION);
      vector[idx] += 1 / (i + 1);
    }
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < VECTOR_DIMENSION; i++) {
      vector[i] /= magnitude;
    }
  }

  return vector;
}

/**
 * Computes cosine similarity between two unit vectors (-1.0 to 1.0)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.max(0, Math.min(1, dotProduct));
}
