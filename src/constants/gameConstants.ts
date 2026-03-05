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

// SVG visual variants per character type
// ADULT alternates between SABA (grandpa) and PARENT based on character id
// KID always renders TEEN
// DOG always renders DOG
export const CHARACTER_VARIANTS: Record<string, string[]> = {
  ADULT: ['SABA', 'PARENT'],
  KID: ['TEEN'],
  DOG: ['DOG'],
};

export const CHARACTER_CONFIG = {
  ADULT: {
    types: ['ADULT'] as const,
    needs: ['WATER', 'CHARGING', 'RECEPTION'] as const,
    timer: 20000, // 20s
  },
  KID: {
    types: ['KID'] as const,
    needs: ['BAMBA', 'BISLI'] as const,
    timer: 14000, // 14s
  },
  DOG: {
    types: ['DOG'] as const,
    needs: ['PET'] as const,
    timer: 10000, // 10s
  },
};

export const SPAWN_INTERVAL = 4000; // 4s
