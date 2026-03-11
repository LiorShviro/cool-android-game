export type CharacterPngKey = 'saba' | 'parent' | 'teen' | 'dog' | 'grandma' | 'soldier' | 'toddler' | 'cat' | 'neighbor' | 'mother' | 'male_teen' | 'boy' | 'girl' | 'dog2';
export type CharacterMood = 'neutral' | 'impatient' | 'urgent';

const modules = import.meta.glob<string>('./pngs/*.png', { eager: true, import: 'default' });

const imageMap = new Map<string, string>();
for (const [path, url] of Object.entries(modules)) {
  const match = path.match(/\/([^/]+)\.png$/);
  if (match) imageMap.set(match[1], url);
}

export const getCharacterPng = (key: CharacterPngKey, mood: CharacterMood): string =>
  imageMap.get(`${key}_${mood}`) ?? '';
