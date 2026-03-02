import React from 'react';
import { render } from '@testing-library/react-native';
import { ReceptionHunter } from '../components/stations/ReceptionHunter';

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    useSharedValue: jest.fn((val) => ({ value: val })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((val) => val),
    runOnJS: jest.fn((fn) => fn),
    default: {
      View: View,
    },
    View: View,
  };
});

// Mock Gesture Handler
const mockPan = {
  onUpdate: jest.fn().mockReturnThis(),
  onEnd: jest.fn().mockReturnThis(),
};

jest.mock('react-native-gesture-handler', () => {
  return {
    GestureDetector: ({ children }: any) => children,
    Gesture: {
      Pan: () => mockPan,
    },
  };
});

describe('ReceptionHunter', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ReceptionHunter onSuccess={jest.fn()} />);
    expect(getByText('RECEPTION')).toBeTruthy();
  });

  it('initializes gesture handlers', () => {
    render(<ReceptionHunter onSuccess={jest.fn()} />);
    expect(mockPan.onUpdate).toHaveBeenCalled();
    expect(mockPan.onEnd).toHaveBeenCalled();
  });
});
