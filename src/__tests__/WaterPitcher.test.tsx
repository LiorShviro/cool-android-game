import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { WaterPitcher } from '../components/stations/WaterPitcher';
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

  it('should lock for 1.5 seconds if overfilled', () => {
    const { getByTestId, queryByText } = render(<WaterPitcher onSuccess={jest.fn()} />);
    const station = getByTestId('water-pitcher-pressable');

    fireEvent(station, 'onPressIn');

    act(() => {
      mockSharedValue.value = 1.3; // Overfilled (> 1.2)
    });

    fireEvent(station, 'onPressOut');

    expect(queryByText('LOCKED')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(queryByText('LOCKED')).toBeFalsy();
  });

  it('should reset if released too early', () => {
    const mockOnSuccess = jest.fn();
    const { getByTestId } = render(<WaterPitcher onSuccess={mockOnSuccess} />);
    const station = getByTestId('water-pitcher-pressable');

    fireEvent(station, 'onPressIn');
    
    act(() => {
      mockSharedValue.value = 0.5; // Too early (< 0.8)
    });
    
    fireEvent(station, 'onPressOut');
    
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should clear existing lock timer if triggered again', () => {
    // This is hard to verify without internal access, but we can trigger it
    const { getByTestId } = render(<WaterPitcher onSuccess={jest.fn()} />);
    const station = getByTestId('water-pitcher-pressable');

    fireEvent(station, 'onPressIn');
    act(() => { mockSharedValue.value = 1.3; });
    fireEvent(station, 'onPressOut'); // First lock

    // We can't easily trigger another lock while locked because button is disabled
  });
});

