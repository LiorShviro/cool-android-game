// Manual mock for Reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  
  const handleWithTiming = (toValue, config, callback) => {
    if (callback) {
      setTimeout(() => callback(true), 0);
    }
    return toValue;
  };

  return {
    useSharedValue: jest.fn((val) => ({ value: val })),
    useAnimatedStyle: jest.fn((cb) => ({})),
    withTiming: jest.fn(handleWithTiming),
    cancelAnimation: jest.fn(),
    interpolateColor: jest.fn(() => 'green'),
    Easing: {
      linear: jest.fn((t) => t),
    },
    runOnJS: jest.fn((fn) => fn),
    default: {
      View: View,
      Text: Text,
    },
    View: View,
    Text: Text,
  };
});
