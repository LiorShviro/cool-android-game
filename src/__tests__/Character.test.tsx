import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Character } from '../components/Character';
import { useGameStore } from '../store/gameStore';

// Mock the store
jest.mock('../store/gameStore', () => {
  return {
    useGameStore: jest.fn(),
  };
});

describe('Character Component', () => {
  const mockUpdateStressMeter = jest.fn();
  const mockRemoveCharacter = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useGameStore as any).mockReturnValue({
      updateStressMeter: mockUpdateStressMeter,
      removeCharacter: mockRemoveCharacter,
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

  it('renders correctly with character details', () => {
    const { getByText } = render(<Character character={mockCharacter} />);

    expect(getByText("💧 I'm thirsty!")).toBeTruthy();
  });

  it('calls updateStressMeter and removeCharacter on timer expiration', () => {
    render(<Character character={mockCharacter} />);

    act(() => {
      jest.runAllTimers();
    });

    expect(mockUpdateStressMeter).toHaveBeenCalledWith(7);
    expect(mockRemoveCharacter).toHaveBeenCalledWith('1');
  });
});

