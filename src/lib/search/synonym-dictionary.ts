export interface ConceptDefinition {
  category: 'emotion' | 'event' | 'visual' | 'relationship' | 'trope' | 'editVibe' | 'character' | 'genre';
  canonical: string;
  synonyms: string[];
  expandedTags: string[];
  suggestedThemes: string[];
}

export const CONCEPT_DICTIONARY: Record<string, ConceptDefinition> = {
  // EMOTIONS
  grief: {
    category: 'emotion',
    canonical: 'grief',
    synonyms: ['mourning', 'bereavement', 'sorrow', 'heartache', 'loss of loved one', 'funeral sadness', 'losing a parent', 'lost someone'],
    expandedTags: ['grief', 'sadness', 'funeral', 'loss', 'crying', 'death', 'emotional', 'tearful'],
    suggestedThemes: ['Parent Death & Mourning', 'Tragic Loss', 'Funeral Scenes', 'Emotional Eulogy'],
  },
  sadness: {
    category: 'emotion',
    canonical: 'sadness',
    synonyms: ['sad', 'depressed', 'crying', 'tears', 'weeping', 'unhappy', 'devastated', 'broken', 'hopeless', 'crying alone'],
    expandedTags: ['sadness', 'crying', 'depression', 'tears', 'heartbreak', 'emotional', 'melancholy', 'pain'],
    suggestedThemes: ['Crying Alone', 'Devastating News', 'Quiet Melancholy', 'Sad Song Edits'],
  },
  heartbreak: {
    category: 'emotion',
    canonical: 'heartbreak',
    synonyms: ['breakup', 'broken heart', 'dumped', 'rejected', 'unrequited love', 'separation', 'parting', 'leaving me'],
    expandedTags: ['heartbreak', 'breakup', 'crying', 'sadness', 'romance', 'rejection', 'alone', 'loss'],
    suggestedThemes: ['Car Breakups', 'Tearful Goodbyes', 'Rejection Scenes', 'Post-Breakup Regret'],
  },
  anger: {
    category: 'emotion',
    canonical: 'anger',
    synonyms: ['angry', 'rage', 'furious', 'screaming', 'mad', 'wrath', 'frustration', 'shouting', 'yelling in rain', 'screaming in the rain'],
    expandedTags: ['anger', 'rage', 'screaming', 'furious', 'fight', 'revenge', 'aggressive', 'destructive'],
    suggestedThemes: ['Screaming in the Rain', 'Rage Outbursts', 'Intense Confrontation', 'Aggressive Velocity Edits'],
  },
  betrayal: {
    category: 'emotion',
    canonical: 'betrayal',
    synonyms: ['betrayed', 'backstabbed', 'treason', 'double crossed', 'disloyalty', 'friend betrayed', 'stabbed in the back', 'deceived', 'lied to'],
    expandedTags: ['betrayal', 'shock', 'revenge', 'disbelief', 'confrontation', 'villain reveal', 'broken trust'],
    suggestedThemes: ['Friend Betrayal Reveal', 'Shocking Treason', 'Confronting the Traitor', 'Villain Unmasking'],
  },
  revenge: {
    category: 'trope',
    canonical: 'revenge',
    synonyms: ['vengeance', 'retribution', 'avenge', 'payback', 'retaliation', 'avenging mother', 'avenging father', 'vendetta'],
    expandedTags: ['revenge', 'badass', 'anger', 'fight', 'dark', 'villain', 'confrontation', 'justice'],
    suggestedThemes: ['Avenging Mother/Family', 'Cold Revenge Walks', 'Final Showdowns', 'Vengeance Arcs'],
  },
  confidence: {
    category: 'emotion',
    canonical: 'confidence',
    synonyms: ['confident', 'badass', 'boss', 'smug', 'swagger', 'unbothered', 'main character energy', 'aura', 'walking scene', 'confident entrance'],
    expandedTags: ['confident', 'badass', 'slow motion', 'walking', 'luxury', 'power', 'entrance', 'hype'],
    suggestedThemes: ['Slow Motion Entrances', 'Billionaire/Boss Aura', 'Unbothered Glow Ups', 'Badass Struts'],
  },
  villain: {
    category: 'character',
    canonical: 'villain',
    synonyms: ['antagonist', 'evil', 'psychopath', 'dark lord', 'villain smile', 'smiling after winning', 'villain reveal', 'villain arc', 'anti-hero'],
    expandedTags: ['villain', 'dark', 'evil', 'smile', 'badass', 'manipulation', 'mastermind', 'reveal'],
    suggestedThemes: ['Villain Smiling in Defeat/Victory', 'Unmasking the Mastermind', 'Villain Monologues', 'Dark Anti-Hero Arcs'],
  },
  loneliness: {
    category: 'emotion',
    canonical: 'loneliness',
    synonyms: ['lonely', 'alone', 'isolation', 'isolated', 'empty room', 'solitude', 'abandoned', 'quiet lonely night', 'sitting alone'],
    expandedTags: ['lonely', 'isolation', 'night', 'empty', 'melancholy', 'sadness', 'quiet', 'reflection'],
    suggestedThemes: ['Late Night Solitude', 'Empty Room Staring', 'Walking Alone in City', 'Feeling Left Behind'],
  },
  romance: {
    category: 'relationship',
    canonical: 'romance',
    synonyms: ['romantic', 'love', 'crush', 'lovers', 'romantic eye contact', 'eye contact', 'staring into eyes', 'kiss', 'kissing', 'confession', 'romantic tension'],
    expandedTags: ['romance', 'love', 'eye contact', 'tension', 'kiss', 'soft', 'aesthetic', 'couple'],
    suggestedThemes: ['Intense Eye Contact / Stare', 'Rain Kisses', 'Love Confessions', 'Unspoken Romantic Tension'],
  },

  // EVENTS
  murder_discovery: {
    category: 'event',
    canonical: 'murder discovery',
    synonyms: ['who killed their mother', 'who killed her mother', 'who killed his mother', 'killed my father', 'killer reveal', 'murderer reveal', 'finds out who killed'],
    expandedTags: ['murder', 'reveal', 'betrayal', 'revenge', 'mother', 'shock', 'family secret', 'investigation', 'grief'],
    suggestedThemes: ['Mother/Parent Murder Truth', 'Shocking Killer Unmasking', 'Family Betrayal Realization', 'Dark Origin Story'],
  },
  panic_attack: {
    category: 'event',
    canonical: 'panic attack',
    synonyms: ['anxiety', 'hyperventilating', 'breakdown', 'mental breakdown', 'panic', 'shaking', 'overwhelmed', 'having a panic attack'],
    expandedTags: ['panic attack', 'anxiety', 'breakdown', 'crying', 'mental health', 'emotional', 'overwhelmed'],
    suggestedThemes: ['Mirror Panic Attacks', 'Breathing Breakdown', 'Sensory Overload', 'Emotional Collapse'],
  },
  fight: {
    category: 'event',
    canonical: 'fight',
    synonyms: ['combat', 'battle', 'brawl', 'action', 'duel', 'fight scene', 'punching', 'martial arts', 'sword fight', 'chase'],
    expandedTags: ['fight', 'action', 'badass', 'combat', 'battle', 'intense', 'hype', 'velocity'],
    suggestedThemes: ['Hand-to-Hand Combat', 'Rain Fights', 'Hallway Fights', 'High Octane Action'],
  },
  reunion: {
    category: 'event',
    canonical: 'reunion',
    synonyms: ['reuniting', 'meeting again', 'seeing each other again', 'coming back home', 'reunited', 'long time no see', 'hug after years'],
    expandedTags: ['reunion', 'emotional', 'hug', 'tears of joy', 'love', 'family', 'friends', 'relief'],
    suggestedThemes: ['Emotional Long-Lost Reunions', 'Tearful Hugs', 'Returning from War/Absence', 'Unexpected Encounter'],
  },
  argument: {
    category: 'event',
    canonical: 'argument',
    synonyms: ['fighting words', 'yelling at each other', 'mother daughter arguing', 'father son fight', 'screaming match', 'shouting', 'family conflict'],
    expandedTags: ['argument', 'yelling', 'family', 'conflict', 'emotional', 'anger', 'tension', 'drama'],
    suggestedThemes: ['Mother-Daughter Screaming Match', 'Family Dinner Meltdown', 'Explosive Heated Arguments', 'Emotional Confrontations'],
  },

  // VISUALS
  rain: {
    category: 'visual',
    canonical: 'rain',
    synonyms: ['raining', 'rainstorm', 'downpour', 'soaked in rain', 'storm', 'wet hair', 'standing in rain'],
    expandedTags: ['rain', 'aesthetic', 'sadness', 'screaming', 'cinematic', 'night', 'emotional'],
    suggestedThemes: ['Screaming in Downpour', 'Sad Walking in Rain', 'Rainy Romance Kisses', 'Melancholy Window Gazing'],
  },
  night: {
    category: 'visual',
    canonical: 'night',
    synonyms: ['midnight', 'darkness', 'neon', 'city lights', 'night drive', 'night sky', 'streetlights', 'night walk'],
    expandedTags: ['night', 'neon', 'aesthetic', 'dark', 'city', 'driving', 'quiet', 'solitude'],
    suggestedThemes: ['Late Night City Drives', 'Neon Street Solitude', 'Rooftop Midnight Chats', 'Dark Aesthetic Nights'],
  },
  party: {
    category: 'visual',
    canonical: 'party',
    synonyms: ['luxury party', 'ball', 'gala', 'rich party', 'club', 'dancing', 'champagne', 'masquerade', 'rich lifestyle'],
    expandedTags: ['party', 'luxury', 'glamour', 'aesthetic', 'music', 'chaotic', 'wealth', 'confident'],
    suggestedThemes: ['Lavish Masquerade Ball', 'High Society Gala', 'Euphoric Club Scene', 'Intoxicated Chaos'],
  },

  // EDIT VIBES
  sad_edit: {
    category: 'editVibe',
    canonical: 'sad edit',
    synonyms: ['clips for a sad edit', 'sad edit clips', 'sad song edit', 'clips for a sad song', 'slowed and reverb clips', 'depressing clips', 'emotional clips'],
    expandedTags: ['sad edit', 'emotional', 'crying', 'heartbreak', 'grief', 'melancholy', 'aesthetic', 'slow'],
    suggestedThemes: ['Deep Sadness & Regret', 'Melancholic Stares', 'Heartbreaking Memories', 'Tears & Goodbyes'],
  },
  velocity: {
    category: 'editVibe',
    canonical: 'velocity',
    synonyms: ['hype edit', 'velocity edit', 'aggressive edit', 'clips for an aggressive edit', 'phonk clips', 'hard edit', 'action sync'],
    expandedTags: ['velocity', 'badass', 'action', 'hype', 'aggressive', 'fight', 'confident', 'speed'],
    suggestedThemes: ['Gunshots & Fast Combat', 'Hard Phonk Stares', 'Weapon Reloads & Flips', 'Punchy Impact Clips'],
  },
  nostalgia: {
    category: 'editVibe',
    canonical: 'nostalgia',
    synonyms: ['nostalgic', 'childhood memories', 'flashback', 'growing up', 'golden hour', 'summer memories', 'vintage', 'innocence'],
    expandedTags: ['nostalgic', 'childhood', 'memories', 'aesthetic', 'warm', 'flashback', 'friendship', 'golden hour'],
    suggestedThemes: ['Childhood Flashbacks', 'Carefree Summer Days', 'Faded Polaroids & Golden Hour', 'Bittersweet Memories'],
  },
};

export const COMMON_TYPOS: Record<string, string> = {
  'cruela': 'cruella',
  'spiderman': 'spider-man',
  'spider man': 'spider-man',
  'rue bennet': 'rue bennett',
  'rue benet': 'rue bennett',
  'intersteller': 'interstellar',
  'bat man': 'batman',
  'oppenhiemer': 'oppenheimer',
  'openheimer': 'oppenheimer',
  'sucession': 'succession',
  'breakingbad': 'breaking bad',
  'strangerthing': 'stranger things',
  'stanger things': 'stranger things',
  'thelastofus': 'the last of us',
  'last of us': 'the last of us',
  'peaky blinder': 'peaky blinders',
  'peakly blinders': 'peaky blinders',
  'euphoriaa': 'euphoria',
  'arcene': 'arcane',
  'jinx': 'jinx',
  'vane': 'vi',
};

export const MOOD_CATEGORIES = [
  { id: 'emotional', label: 'Emotional', icon: 'HeartHandshake', query: 'find me emotional clips' },
  { id: 'heartbreak', label: 'Heartbreak', icon: 'HeartCrack', query: 'sad breakup scenes' },
  { id: 'romance', label: 'Romance', icon: 'Sparkles', query: 'romantic eye contact' },
  { id: 'revenge', label: 'Revenge', icon: 'Flame', query: 'angry revenge scenes' },
  { id: 'angry', label: 'Angry', icon: 'Zap', query: 'screaming in the rain' },
  { id: 'happy', label: 'Happy', icon: 'Smile', query: 'happy reunion scenes' },
  { id: 'funny', label: 'Funny', icon: 'Laugh', query: 'chaotic funny scenes' },
  { id: 'lonely', label: 'Lonely', icon: 'Moon', query: 'quiet lonely night scenes' },
  { id: 'betrayal', label: 'Betrayal', icon: 'ShieldAlert', query: 'someone realizes they were betrayed' },
  { id: 'villain', label: 'Villain', icon: 'Skull', query: 'villain smiling after winning' },
  { id: 'badass', label: 'Badass', icon: 'Swords', query: 'confident entrance scene' },
  { id: 'nostalgic', label: 'Nostalgic', icon: 'Clock', query: 'nostalgic childhood memories' },
  { id: 'scary', label: 'Scary', icon: 'EyeOff', query: 'scared person hiding' },
  { id: 'confident', label: 'Confident', icon: 'Crown', query: 'badass walking scene' },
  { id: 'fight', label: 'Fight', icon: 'Crosshair', query: 'intense fight scene' },
  { id: 'crying', label: 'Crying', icon: 'Droplets', query: 'girl crying after losing someone' },
  { id: 'friendship', label: 'Friendship', icon: 'Users', query: 'friends hugging goodbye' },
  { id: 'grief', label: 'Grief', icon: 'FlameKindling', query: 'someone finds out who killed their mother' },
];
