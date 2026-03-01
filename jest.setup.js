// Manual mock for Reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  return {
    useSharedValue: (val) => ({ value: val }),
    useAnimatedStyle: (cb) => ({}),
    withTiming: (toValue, config, callback) => {
      if (callback) {
        setTimeout(() => callback(true), 0);
      }
      return toValue;
    },
    interpolateColor: () => 'green',
    Easing: {
      linear: (t) => t,
    },
    runOnJS: (fn) => fn,
    default: {
      View: View,
      Text: Text,
    },
    View: View,
    Text: Text,
  };
});
