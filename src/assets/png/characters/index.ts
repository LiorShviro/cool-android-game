import { ImageSourcePropType } from 'react-native';

export type CharacterPngKey = 'saba' | 'parent' | 'teen' | 'dog' | 'grandma' | 'soldier' | 'toddler' | 'cat' | 'neighbor' | 'mother' | 'male_teen' | 'boy' | 'girl' | 'dog2';
export type CharacterMood = 'neutral' | 'impatient' | 'urgent';

const characterPngs: Record<CharacterPngKey, Record<CharacterMood, ImageSourcePropType>> = {
  saba: {
    neutral: require('./saba_neutral.png'),
    impatient: require('./saba_impatient.png'),
    urgent: require('./saba_urgent.png'),
  },
  parent: {
    neutral: require('./parent_neutral.png'),
    impatient: require('./parent_impatient.png'),
    urgent: require('./parent_urgent.png'),
  },
  teen: {
    neutral: require('./teen_neutral.png'),
    impatient: require('./teen_impatient.png'),
    urgent: require('./teen_urgent.png'),
  },
  dog: {
    neutral: require('./dog_neutral.png'),
    impatient: require('./dog_impatient.png'),
    urgent: require('./dog_urgent.png'),
  },
  // New characters — placeholder PNGs (replace with real art when available)
  grandma: {
    neutral: require('./grandma_neutral.png'),
    impatient: require('./grandma_impatient.png'),
    urgent: require('./grandma_urgent.png'),
  },
  soldier: {
    neutral: require('./soldier_neutral.png'),
    impatient: require('./soldier_impatient.png'),
    urgent: require('./soldier_urgent.png'),
  },
  toddler: {
    neutral: require('./toddler_neutral.png'),
    impatient: require('./toddler_impatient.png'),
    urgent: require('./toddler_urgent.png'),
  },
  cat: {
    neutral: require('./cat_neutral.png'),
    impatient: require('./cat_impatient.png'),
    urgent: require('./cat_urgent.png'),
  },
  neighbor: {
    neutral: require('./neighbor_neutral.png'),
    impatient: require('./neighbor_impatient.png'),
    urgent: require('./neighbor_urgent.png'),
  },
  mother: {
    neutral: require('./mother_neutral.png'),
    impatient: require('./mother_impatient.png'),
    urgent: require('./mother_urgent.png'),
  },
  male_teen: {
    neutral: require('./male_teen_neutral.png'),
    impatient: require('./male_teen_impatient.png'),
    urgent: require('./male_teen_urgent.png'),
  },
  boy: {
    neutral: require('./boy_neutral.png'),
    impatient: require('./boy_impatient.png'),
    urgent: require('./boy_urgent.png'),
  },
  girl: {
    neutral: require('./girl_neutral.png'),
    impatient: require('./girl_impatient.png'),
    urgent: require('./girl_urgent.png'),
  },
  dog2: {
    neutral: require('./dog2_neutral.png'),
    impatient: require('./dog2_impatient.png'),
    urgent: require('./dog2_urgent.png'),
  },
};

export const getCharacterPng = (key: CharacterPngKey, mood: CharacterMood): ImageSourcePropType =>
  characterPngs[key][mood];
