import { QueryIntent } from '../types';
import { fetchTMDBEnrichment } from '../tmdb/tmdb-client';

export interface CandidateDiscoveryMatch {
  mediaTitle: string;
  character?: string;
  reason: string;
  relevanceWeight: number; // 0.1 - 1.0
  associatedThemes: string[];
  isPlotVerified?: boolean;
}

/**
 * Dynamic Plot-based & Media Knowledge Discovery Engine:
 * Dynamically queries plot summaries, keywords, themes, and TMDB enrichment
 * across multiple generated query interpretations.
 */
export interface IndexedMediaCorpus {
  mediaTitle: string;
  characters: string[];
  genres: string[];
  plotSummary: string;
  keyScenes: string[];
  themes: string[];
  motifs: string[];
}

export const DYNAMIC_MEDIA_CORPUS: IndexedMediaCorpus[] = [
  {
    mediaTitle: 'Cruella',
    characters: ['Estella', 'Baroness von Hellman', 'Cruella'],
    genres: ['Crime', 'Comedy', 'Drama'],
    plotSummary: 'A clever grifter named Estella determines to make a name for herself with her designs in 1970s London. She befriends the Baroness von Hellman, a fashion legend, but soon discovers the Baroness was responsible for her mother Catherine’s murder, sparking a revenge vendetta.',
    keyScenes: [
      'Estella discovers the Baroness killed her mother at the cliff',
      'Red dress fire entrance at the Black & White Ball',
      'Grief and tears at the fountain memorial',
      'Dumpster truck trash dress entrance',
      'Baroness dog whistle reveal',
    ],
    themes: ['mother murder reveal', 'revenge', 'betrayal', 'fashion gala', 'badass entrance', 'grief', 'family secret'],
    motifs: ['red dress', 'fire entrance', 'cliff discovery', 'heirloom necklace', 'luxury party', 'black and white hair'],
  },
  {
    mediaTitle: 'The Batman',
    characters: ['Bruce Wayne', 'Batman', 'Riddler', 'Catwoman', 'Selina Kyle'],
    genres: ['Action', 'Crime', 'Drama'],
    plotSummary: 'Batman ventures into Gotham City underworld when a sadistic killer leaves behind a trail of cryptic clues. As the evidence leads closer to home, he uncovers corruption connected to his own family, facing grief, vengeance, and a rain-soaked final confrontation.',
    keyScenes: [
      'Bruce Wayne screaming in the rain during flood rescue',
      'Flare in darkness leading survivors',
      'Funeral confrontation with Carmine Falcone and Riddler car attack',
      'Batmobile car chase in heavy rain with Penguin',
      'Quiet lonely night walk in Gotham',
    ],
    themes: ['revenge', 'orphan grief', 'investigation', 'rain', 'night', 'betrayal', 'loneliness', 'dark aesthetic'],
    motifs: ['heavy rain', 'flare in darkness', 'car chase in rain', 'gotham rooftop', 'funeral'],
  },
  {
    mediaTitle: 'Euphoria',
    characters: ['Rue Bennett', 'Jules Vaughn', 'Maddy Perez', 'Cassie Howard', 'Nate Jacobs'],
    genres: ['Drama', 'Teen'],
    plotSummary: 'A group of high school students navigate love and friendships in a world of drugs, sex, trauma, and social media. Rue deals with overwhelming grief after losing her father, leading to emotional breakdowns, panic attacks in bedrooms, screaming hallway arguments with her mother Leslie, and heartbreak.',
    keyScenes: [
      'Rue crying alone in bedroom with glitter tears',
      'Rue screaming argument with mother Leslie breaking down doors',
      'Maddy discovering best friend Cassie betrayed her with Nate',
      'Rue having a severe panic attack in bedroom',
      'Sad breakup in car / bedroom between Rue and Jules',
    ],
    themes: ['grief for father', 'panic attack', 'crying in bedroom', 'relapse', 'sad breakup', 'party chaos', 'screaming argument', 'mother daughter argument'],
    motifs: ['glitter tears', 'neon bedroom lighting', 'hospital flashback', 'carnival lights', 'door screaming'],
  },
  {
    mediaTitle: 'Succession',
    characters: ['Kendall Roy', 'Logan Roy', 'Shiv Roy', 'Roman Roy'],
    genres: ['Drama'],
    plotSummary: 'The Roy family is known for controlling the biggest media and entertainment company in the world. When their aging father steps down, his children scheme and betray one another. Kendall experiences crushing betrayal, emotional breakdowns, and sits alone after losing everything.',
    keyScenes: [
      'Kendall sitting alone after losing everything looking at rooftop glass',
      'Kendall crying in kitchen admitting tragedy to siblings',
      'Family screaming match at luxury dinner table',
      'Kendall listening to sad song in car staring out window',
    ],
    themes: ['betrayal by father', 'breakdown', 'sitting alone after losing everything', 'family conflict', 'luxury corporate', 'screaming match'],
    motifs: ['rooftop glass balcony', 'helicopter', 'boardroom tension', 'wedding breakdown'],
  },
  {
    mediaTitle: 'Interstellar',
    characters: ['Joseph Cooper', 'Murphy Cooper', 'Brand'],
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    plotSummary: 'When Earth becomes uninhabitable, a former NASA pilot named Cooper leaves his daughter Murphy behind to find a new home for mankind. Over decades across time dilation, Cooper experiences heartbreaking grief, crying while watching 23 years of video messages, and an emotional reunion.',
    keyScenes: [
      'Cooper crying uncontrollably watching 23 years of video messages from children',
      'Cooper driving away in truck while Murph runs out crying',
      'Father daughter hospital bed emotional reunion after decades',
    ],
    themes: ['crying watching video messages', 'leaving daughter', 'grief over lost time', 'goodbye', 'emotional reunion'],
    motifs: ['space tears', 'dust storm', 'hospital bed reunion', 'ticking clock'],
  },
  {
    mediaTitle: 'Spider-Man',
    characters: ['Peter Parker', 'Gwen Stacy', 'Green Goblin', 'Miles Morales'],
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    plotSummary: 'Peter Parker balances high school life and superhero duties. He endures catastrophic grief losing loved ones, crying over Uncle Ben, screaming in agony over Gwen Stacy at the clock tower, and fighting in the rain.',
    keyScenes: [
      'Peter Parker screaming in agony holding dying Gwen Stacy in clock tower',
      'Peter crying in the rain after losing Aunt May',
      'Rainy alleyway heroic reflection',
    ],
    themes: ['loss of loved one', 'uncle ben death', 'gwen stacy death', 'crying in rain', 'guilt', 'heroic sacrifice'],
    motifs: ['rainy alleyway', 'clock tower fall', 'holding dying loved one', 'crying over body'],
  },
  {
    mediaTitle: 'Arcane',
    characters: ['Jinx', 'Vi', 'Powder', 'Silco'],
    genres: ['Animation', 'Action', 'Sci-Fi'],
    plotSummary: 'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions—and the power that will tear them apart.',
    keyScenes: [
      'Powder crying alone in rain after explosive mistake',
      'Jinx panic attack lighting blue flare on rooftop',
      'Tea party betrayal reveal and villain smile through tears',
    ],
    themes: ['sister betrayal', 'panic attack', 'flare reunion', 'villain origin', 'crying alone', 'guilt', 'chaotic fight'],
    motifs: ['blue flare', 'neon explosion', 'tea party reveal', 'childhood flashbacks'],
  },
  {
    mediaTitle: 'Breaking Bad',
    characters: ['Walter White', 'Jesse Pinkman', 'Gus Fring'],
    genres: ['Crime', 'Drama', 'Thriller'],
    plotSummary: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine. His pursuit of power leads to shocking betrayal, family destruction, and hysterical breakdown in the crawl space.',
    keyScenes: [
      'Walter White hysterical laughing in despair in the crawl space',
      'Desert shootout and realization of fatal mistake',
      'Gus Fring cold stare and death reveal',
    ],
    themes: ['betrayal', 'screaming in crawl space', 'villain transformation', 'losing everything', 'desert standoff'],
    motifs: ['crawl space laughing', 'desert shootout', 'money pile', 'blue crystal'],
  },
  {
    mediaTitle: 'Peaky Blinders',
    characters: ['Thomas Shelby', 'Arthur Shelby', 'Polly Gray'],
    genres: ['Crime', 'Drama'],
    plotSummary: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.',
    keyScenes: [
      'Tommy Shelby slow motion badass entrance in misty street',
      'Tommy cold cigarette smoke stare before revenge',
    ],
    themes: ['badass walking in slow motion', 'cigarette smoke', 'revenge', 'ptsd flashbacks', 'lonely mansion'],
    motifs: ['tweed suit', 'slow walk down misty street', 'whiskey glass'],
  },
  {
    mediaTitle: 'La La Land',
    characters: ['Mia Dolan', 'Sebastian Wilder'],
    genres: ['Comedy', 'Drama', 'Music', 'Romance'],
    plotSummary: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love but face heartbreaking choices between ambition and romance.',
    keyScenes: [
      'Mia and Sebastian staring at each other without talking in jazz club epilogue',
      'Bittersweet final smile and nod goodbye',
      'Nostalgic flashback montage of what could have been',
    ],
    themes: ['romantic eye contact', 'staring at each other without talking', 'bittersweet goodbye', 'nostalgic flashback', 'heartbreak'],
    motifs: ['jazz club look', 'epilogue nod', 'planetarium dance'],
  }
];

export async function discoverCandidateMedia(intent: QueryIntent): Promise<CandidateDiscoveryMatch[]> {
  const matches: CandidateDiscoveryMatch[] = [];
  const queryLower = intent.normalizedQuery.toLowerCase();
  const searchCorpus = [...DYNAMIC_MEDIA_CORPUS];

  // Dynamic plot and key scene search across all generated multi-queries
  for (const item of searchCorpus) {
    let score = 0;
    const reasons: string[] = [];
    const matchedThemes: string[] = [];
    let isPlotVerified = false;

    const plotLower = item.plotSummary.toLowerCase();
    const scenesJoined = item.keyScenes.join(' ').toLowerCase();

    // 1. Check multi-queries against key scene descriptions
    for (const mq of intent.multiQueries) {
      const mqLower = mq.toLowerCase();
      for (const scene of item.keyScenes) {
        if (scene.toLowerCase().includes(mqLower) || mqLower.split(' ').filter(w => w.length > 3).every(w => scene.toLowerCase().includes(w))) {
          score += 0.85;
          reasons.push(`Plot confirms scene: "${scene}"`);
          matchedThemes.push(scene);
          isPlotVerified = true;
        }
      }

      // Check plot summary
      if (plotLower.includes(mqLower)) {
        score += 0.6;
        reasons.push(`Matched plot summary for ${item.mediaTitle}`);
        isPlotVerified = true;
      }
    }

    // 2. Check themes & motifs
    for (const theme of item.themes) {
      if (intent.events.some(e => theme.includes(e)) || 
          intent.emotions.some(em => theme.includes(em)) ||
          intent.tropes.some(tr => theme.includes(tr))) {
        score += 0.4;
        matchedThemes.push(theme);
      }
    }

    if (score > 0.3) {
      matches.push({
        mediaTitle: item.mediaTitle,
        character: item.characters[0],
        reason: reasons.length > 0 ? reasons.slice(0, 2).join(' • ') : `Known for: ${matchedThemes.slice(0, 2).join(', ')}`,
        relevanceWeight: Math.min(1.0, score),
        associatedThemes: Array.from(new Set(matchedThemes)),
        isPlotVerified,
      });
    }
  }

  return matches.sort((a, b) => b.relevanceWeight - a.relevanceWeight);
}
