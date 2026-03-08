import { ImageSourcePropType } from 'react-native';

export const OBSTACLE_PNGS: Record<string, ImageSourcePropType> = {
  box: require('./box.png'),
  chair: require('./chair.png'),
  toy: require('./toy.png'),
  shoe: require('./shoe.png'),
  bathroomDoor: require('./bathroom_door.png'),
};

export const RUNNER_PNG: ImageSourcePropType = require('./runner.png');
