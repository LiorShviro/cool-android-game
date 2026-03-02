import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Character } from '../components/Character';
import { useGameStore } from '../store/gameStore';

// Mock the store
jest.mock('../store/gameStore', () => {
  return {
    useGameStore: jest.fn(),
  };
});

describe('Character Component', () => {
  const mockRemoveCharacter = jest.fn();
  const mockDecrementLives = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useGameStore as any).mockReturnValue({
      removeCharacter: mockRemoveCharacter,
      decrementLives: mockDecrementLives,
      isPaused: false,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const mockCharacter = {
    id: '1',
    type: 'ADULT' as const,
    need: 'WATER',
    timer: 15000,
  };

  it('renders correctly with character speech line', () => {
    const { getByText } = render(<Character character={mockCharacter} />);
    
    // Check for speech line based on WATER need (using regex to avoid emoji issues)
    expect(getByText(/I'm thirsty/)).toBeTruthy();
  });

  it('calls decrementLives and removeCharacter on timer expiration', () => {
    render(<Character character={mockCharacter} />);
    
    act(() => {
      jest.runAllTimers();
    });
    
    expect(mockDecrementLives).toHaveBeenCalled();
    expect(mockRemoveCharacter).toHaveBeenCalledWith('1');
  });
});
