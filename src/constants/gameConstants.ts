export const CHARACTER_CONFIG = {
  ADULT: {
    types: ['ADULT'] as const,
    needs: ['WATER', 'CHARGING', 'RECEPTION'] as const,
    timer: 15000, // 15s
  },
  KID: {
    types: ['KID'] as const,
    needs: ['BAMBA', 'BISLI'] as const,
    timer: 10000, // 10s
  },
  DOG: {
    types: ['DOG'] as const,
    needs: ['PET'] as const,
    timer: 7000, // 7s
  },
};

export const SPAWN_INTERVAL = 3000; // 3s
