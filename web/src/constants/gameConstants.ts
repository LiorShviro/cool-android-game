export const SPEECH_LINES_BY_NEED: Record<string, string[]> = {
  WATER: ['I\'m thirsty!', 'Need water!', 'Pour me a cup!'],
  CHARGING: ['Phone dying!', 'Charge me!', 'Low battery!'],
  RECEPTION: ['No signal!', 'Find reception!', 'Help me call!'],
  BAMBA: ['Want Bamba!', 'Bamba please!', 'Need a snack!'],
  BISLI: ['Want Bisli!', 'Bisli please!', 'Snack time!'],
  PET: ['Throw the ball!', 'Let\'s play!', 'Toss it!'],
};

export const pickSpeechLine = (need: string) => {
  const lines = SPEECH_LINES_BY_NEED[need];
  if (!lines || lines.length === 0) return need;
  return lines[Math.floor(Math.random() * lines.length)];
};

export const CHARACTER_EMOJIS: Record<string, string[]> = {
  ADULT: ['👨', '👩'],
  KID: ['👦', '👧'],
  DOG: ['🐕'],
};

// Visual variants per character type — extensible list
export const CHARACTER_VARIANTS: Record<string, string[]> = {
  ADULT: ['SABA', 'PARENT', 'GRANDMA', 'SOLDIER', 'NEIGHBOR', 'MOTHER'],
  KID: ['TEEN', 'TODDLER', 'MALE_TEEN', 'BOY', 'GIRL'],
  DOG: ['DOG', 'CAT', 'DOG2'],
};

// Maps variant name to CharacterPngKey
export const VARIANT_TO_PNG_KEY: Record<string, string> = {
  SABA: 'saba',
  PARENT: 'parent',
  TEEN: 'teen',
  DOG: 'dog',
  GRANDMA: 'grandma',
  SOLDIER: 'soldier',
  NEIGHBOR: 'neighbor',
  TODDLER: 'toddler',
  CAT: 'cat',
  MOTHER: 'mother',
  MALE_TEEN: 'male_teen',
  BOY: 'boy',
  GIRL: 'girl',
  DOG2: 'dog2',
};

export const CHARACTER_CONFIG = {
  ADULT: {
    types: ['ADULT'] as const,
    needs: ['WATER', 'CHARGING', 'RECEPTION'] as const,
    timer: 20000,
  },
  KID: {
    types: ['KID'] as const,
    needs: ['BAMBA', 'BISLI'] as const,
    timer: 14000,
  },
  DOG: {
    types: ['DOG'] as const,
    needs: ['PET'] as const,
    timer: 10000,
  },
};

export const SPAWN_INTERVAL = 4000;

// Difficulty scaling constants
export const SPAWN_INTERVAL_DECAY_PER_1K = 750;
export const MIN_SPAWN_INTERVAL = 750;
export const TIMER_DECAY_PER_1K = 1500;
export const MIN_TIMER = 2000;
export const MAX_ACTIVE_CHARACTERS = 4;
export const MAX_ACTIVE_CHARACTERS_HIGH = 5;
export const HIGH_SCORE_THRESHOLD = 5000;
export const SUPPLY_RUN_SCORE_INTERVAL = 2000;

export const SUPPLY_RUN_ITEMS: { key: string; displayName: string; tintColor: string }[] = [
  { key: 'toilet_paper', displayName: 'נייר טואלט', tintColor: '#f0f0f0' },
  { key: 'playing_cards', displayName: 'קלפים', tintColor: '#ef4444' },
  { key: 'flashlight', displayName: 'פנס', tintColor: '#fbbf24' },
  { key: 'stuffed_animal', displayName: 'בובה', tintColor: '#f472b6' },
  { key: 'sandwich', displayName: 'כריך', tintColor: '#d97706' },
  { key: 'cafe_shachor', displayName: 'קפה שחור', tintColor: '#451a03' },
  { key: 'black_coffee', displayName: 'קפה שחור', tintColor: '#6b3a1f' },
];
