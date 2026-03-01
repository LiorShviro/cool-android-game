// Mock MMKV
jest.mock('react-native-mmkv', () => {
  return {
    MMKV: jest.fn().mockImplementation(() => {
      return {
        set: jest.fn(),
        getString: jest.fn(),
        delete: jest.fn(),
      };
    }),
  };
});

// Manual mock for Reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  return {
    useSharedValue: jest.fn((val) => ({ value: val })),
    useAnimatedStyle: jest.fn((cb) => ({})),
    withTiming: jest.fn((toValue, config, callback) => {
      if (callback) setTimeout(() => callback(true), 0);
      return toValue;
    }),
    cancelAnimation: jest.fn(),
    interpolateColor: jest.fn(() => 'green'),
    Easing: { linear: jest.fn((t) => t), out: (cb) => cb, in: (cb) => cb, quad: (t) => t },
    runOnJS: jest.fn((fn) => fn),
    withRepeat: jest.fn((val) => val),
    withSequence: jest.fn((...vals) => vals[0]),
    default: { View, Text },
    View,
    Text,
  };
});

// Mock PanResponder
jest.mock('react-native/Libraries/Interaction/PanResponder', () => {
  return {
    default: {
      create: (config) => ({
        panHandlers: {
          onResponderRelease: (e, gestureState) => {
            if (config.onPanResponderRelease) {
              config.onPanResponderRelease(e, gestureState);
            }
          },
        },
      }),
    },
    create: (config) => ({
      panHandlers: {
        onResponderRelease: (e, gestureState) => {
          if (config.onPanResponderRelease) {
            config.onPanResponderRelease(e, gestureState);
          }
        },
      },
    }),
  };
});
