const modules = import.meta.glob<string>('./pngs/*.png', { eager: true, import: 'default' });

const imageMap = new Map<string, string>();
for (const [path, url] of Object.entries(modules)) {
  const match = path.match(/\/([^/]+)\.png$/);
  if (match) imageMap.set(match[1], url);
}

export const STATION_PNGS = {
  chargePhone: imageMap.get('charge_phone') ?? '',
  chargePlug: imageMap.get('charge_plug') ?? '',
  waterCupBase: imageMap.get('water_cup_base') ?? '',
  snackBag: imageMap.get('snack_bag') ?? '',
  bamba: imageMap.get('bamba') ?? '',
  bisly: imageMap.get('bisly') ?? '',
  dogBall: imageMap.get('dog_ball') ?? '',
  receptionHandPhone: imageMap.get('reception_hand_phone') ?? '',
};
