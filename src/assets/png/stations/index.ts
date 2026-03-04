import { ImageSourcePropType } from 'react-native';

export interface StationPngSet {
  chargePhone: ImageSourcePropType;
  chargePlug: ImageSourcePropType;
  waterCupBase: ImageSourcePropType;
  snackBag: ImageSourcePropType;
  bamba: ImageSourcePropType;
  bisly: ImageSourcePropType;
  dogBall: ImageSourcePropType;
  receptionHandPhone: ImageSourcePropType;
}

export const STATION_PNGS: StationPngSet = {
  chargePhone: require('./charge_phone.png'),
  chargePlug: require('./charge_plug.png'),
  waterCupBase: require('./water_cup_base.png'),
  snackBag: require('./snack_bag.png'),
  bamba: require('./bamba.png'),
  bisly: require('./bisly.png'),
  dogBall: require('./dog_ball.png'),
  receptionHandPhone: require('./reception_hand_phone.png'),
};
