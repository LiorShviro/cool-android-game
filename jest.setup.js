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

// Mock Haptic Feedback
jest.mock('react-native-haptic-feedback', () => {
  return {
    trigger: jest.fn(),
  };
});

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
    Easing: { linear: jest.fn((t) => t), out: (cb) => cb, in: (cb) => cb, quad: (t) => t },
    runOnJS: jest.fn((fn) => fn),
    withRepeat: jest.fn((val) => val),
    withSequence: jest.fn((...vals) => vals[0]),
    withSpring: jest.fn((val) => val),
    useAnimatedReaction: jest.fn(),
    default: {
      View: View,
      Text: Text,
    },
    View: View,
    Text: Text,
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createPanGesture = () => {
    const gesture = {};
    gesture.onUpdate = jest.fn(() => gesture);
    gesture.onEnd = jest.fn(() => gesture);
    gesture.onChange = jest.fn(() => gesture);
    gesture.onBegin = jest.fn(() => gesture);
    gesture.onFinalize = jest.fn(() => gesture);
    return gesture;
  };

  return {
    GestureHandlerRootView: ({ children, style }) =>
      React.createElement(View, { style }, children),
    GestureDetector: ({ children }) => children,
    Gesture: {
      Pan: jest.fn(() => createPanGesture()),
    },
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
