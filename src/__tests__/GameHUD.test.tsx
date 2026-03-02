import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameHUD } from '../components/GameHUD';
import { useGameStore } from '../store/gameStore';

// Mock the store
jest.mock('../store/gameStore', () => {
  return {
    useGameStore: jest.fn(),
  };
});

// Mock sub-components
jest.mock('../components/RocketHUD', () => ({
  RocketHUD: () => null,
}));

describe('GameHUD', () => {
  const mockTogglePause = jest.fn();

  beforeEach(() => {
    (useGameStore as any).mockReturnValue({
      score: 1250,
      comboStreak: 4,
      togglePause: mockTogglePause,
    });
  });

  it('renders correctly with score and streak', () => {
    const { getByText } = render(<GameHUD />);
    expect(getByText(/1250/)).toBeTruthy();
    expect(getByText(/x3/)).toBeTruthy(); // streak 4 = multiplier 3
  });

  it('calls togglePause when pause button is pressed', () => {
    const { getByTestId } = render(<GameHUD />);
    fireEvent.press(getByTestId('pause-button'));
    expect(mockTogglePause).toHaveBeenCalled();
  });
});
