export const SPEECH_LINES: Record<string, string> = {
  WATER: '💧 I\'m thirsty!',
  CHARGING: '🔋 Phone dying!',
  RECEPTION: '📶 No signal!',
  BAMBA: '🥜 Want Bamba!',
  BISLI: '🌀 Want Bisli!',
  PET: '🐾 Pet me!',
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
