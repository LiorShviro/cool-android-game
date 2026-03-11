const modules = import.meta.glob<string>('./pngs/*.png', { eager: true, import: 'default' });

const imageMap = new Map<string, string>();
for (const [path, url] of Object.entries(modules)) {
  const match = path.match(/\/([^/]+)\.png$/);
  if (match) imageMap.set(match[1], url);
}

export const BACKGROUND_PNGS = {
  mamadRoom: imageMap.get('mamad_room') ?? '',
  supplyRun: imageMap.get('corridor') ?? '',
};
