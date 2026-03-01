import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { WaterPitcher } from '../src/components/stations/WaterPitcher';
import { useSharedValue } from 'react-native-reanimated';

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  return {
    useSharedValue: jest.fn(),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((val) => val),
    cancelAnimation: jest.fn(),
    Easing: {
      linear: jest.fn(),
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

describe('WaterPitcher Station', () => {
  let mockSharedValue: { value: number };

  beforeEach(() => {
    jest.useFakeTimers();
    mockSharedValue = { value: 0 };
    (useSharedValue as jest.Mock).mockReturnValue(mockSharedValue);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<WaterPitcher onSuccess={jest.fn()} />);
    expect(getByText('WATER')).toBeTruthy();
  });

  it('should start filling when pressed and stop when released', () => {
    const mockOnSuccess = jest.fn();
    const { getByTestId } = render(<WaterPitcher onSuccess={mockOnSuccess} />);
    const station = getByTestId('water-pitcher-pressable');

    fireEvent(station, 'onPressIn');
    
    // Manually simulate filling
    act(() => {
      mockSharedValue.value = 0.9; // Target range (0.8 - 1.1)
    });
    
    fireEvent(station, 'onPressOut');
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should lock for 3 seconds if overfilled', () => {
    const { getByTestId, queryByText, getByText } = render(<WaterPitcher onSuccess={jest.fn()} />);
    const station = getByTestId('water-pitcher-pressable');

    fireEvent(station, 'onPressIn');
    
    act(() => {
      mockSharedValue.value = 1.2; // Overfilled (> 1.1)
    });
    
    fireEvent(station, 'onPressOut');
    
    expect(queryByText('LOCKED')).toBeTruthy();
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(queryByText('LOCKED')).toBeFalsy();
  });
});
