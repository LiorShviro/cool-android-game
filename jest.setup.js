/* eslint-env jest */
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

// Mock Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  return {
    GestureDetector: ({ children }: any) => children,
    Gesture: {
      Pan: () => ({
        onUpdate: (fn: any) => ({
          onEnd: (fn2: any) => ({}),
        }),
        onStart: (fn: any) => ({
            onUpdate: (fn2: any) => ({
                onEnd: (fn3: any) => ({}),
            }),
        }),
      }),
      Tap: () => ({
        onEnd: (fn: any) => ({}),
      }),
    },
    GestureHandlerRootView: ({ children }: any) => children,
    State: {},
    Directions: {},
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
    withTiming: jest.fn(handleWithTiming),
    cancelAnimation: jest.fn(),
    interpolateColor: jest.fn(() => 'green'),
    Easing: { linear: jest.fn((t) => t), out: (cb) => cb, in: (cb) => cb, inOut: (cb) => cb, quad: (t) => t, sin: (t) => t, ease: (t) => t },
    createAnimatedComponent: jest.fn((Component) => Component),
    useAnimatedProps: jest.fn(() => ({})),
    runOnJS: jest.fn((fn) => fn),
    withRepeat: jest.fn((val) => val),
    withSequence: jest.fn((...vals) => vals[0]),
    withSpring: jest.fn((val) => val),
    useAnimatedReaction: jest.fn(),
    useAnimatedStyle: jest.fn(() => ({})),
    default: {
      View: View,
      Text: Text,
      createAnimatedComponent: jest.fn((Component) => Component),
    },
    View: View,
    Text: Text,
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
