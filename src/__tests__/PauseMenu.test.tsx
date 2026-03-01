import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PauseMenu } from '../components/PauseMenu';
import { useGameStore, GameState } from '../store/gameStore';

// Mock the store
jest.mock('../store/gameStore', () => {
  return {
    useGameStore: jest.fn(),
    GameState: {
      START: 'START',
      PLAYING: 'PLAYING',
      GAME_OVER: 'GAME_OVER',
    },
  };
});

describe('PauseMenu', () => {
  const mockTogglePause = jest.fn();
  const mockSetGameState = jest.fn();

  beforeEach(() => {
    (useGameStore as any).mockReturnValue({
      isPaused: true,
      togglePause: mockTogglePause,
      setGameState: mockSetGameState,
    });
  });

  it('renders correctly when paused', () => {
    const { getByText } = render(<PauseMenu />);
    expect(getByText('GAME PAUSED')).toBeTruthy();
    expect(getByText('RESUME')).toBeTruthy();
    expect(getByText('QUIT TO MENU')).toBeTruthy();
  });

  it('calls togglePause when resume is pressed', () => {
    const { getByText } = render(<PauseMenu />);
    fireEvent.press(getByText('RESUME'));
    expect(mockTogglePause).toHaveBeenCalled();
  });

  it('calls setGameState and togglePause when quit is pressed', () => {
    const { getByText } = render(<PauseMenu />);
    fireEvent.press(getByText('QUIT TO MENU'));
    expect(mockSetGameState).toHaveBeenCalledWith('START');
    expect(mockTogglePause).toHaveBeenCalled();
  });
});
