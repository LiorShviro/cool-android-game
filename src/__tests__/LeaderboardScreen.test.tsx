import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LeaderboardScreen } from '../components/LeaderboardScreen';

describe('LeaderboardScreen', () => {
  const mockEntries = [
    { name: 'Player 1', score: 500, date: '2026-03-01' },
    { name: 'Player 2', score: 300, date: '2026-03-01' },
  ];

  it('renders scores correctly', () => {
    const { getByText } = render(
      <LeaderboardScreen entries={mockEntries} onBack={jest.fn()} />
    );
    expect(getByText(/LEADERBOARD/)).toBeTruthy();
    expect(getByText(/Player 1/)).toBeTruthy();
    expect(getByText(/500/)).toBeTruthy();
    expect(getByText(/Player 2/)).toBeTruthy();
    expect(getByText(/300/)).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const mockOnBack = jest.fn();
    const { getByText } = render(
      <LeaderboardScreen entries={mockEntries} onBack={mockOnBack} />
    );
    fireEvent.press(getByText('BACK'));
    expect(mockOnBack).toHaveBeenCalled();
  });
});
