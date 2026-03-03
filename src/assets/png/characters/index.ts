import { ImageSourcePropType } from 'react-native';

export type CharacterPngKey = 'saba' | 'parent' | 'teen' | 'dog';
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
};

export const getCharacterPng = (key: CharacterPngKey, mood: CharacterMood): ImageSourcePropType =>
  characterPngs[key][mood];
