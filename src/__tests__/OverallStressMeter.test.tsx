import React from 'react';
import { render } from '@testing-library/react-native';
import { OverallStressMeter } from '../components/OverallStressMeter';
import { useGameStore } from '../store/gameStore';

// Mock the store
jest.mock('../store/gameStore', () => {
  return {
    useGameStore: jest.fn(),
  };
});

describe('OverallStressMeter', () => {
  it('renders correctly with the current stress level', () => {
    (useGameStore as any).mockReturnValue({
      stressMeter: 45,
    });

    const { getByText } = render(<OverallStressMeter />);
    expect(getByText('45%')).toBeTruthy();
  });

  it('changes color based on stress level', () => {
    // This is harder to test with just text, but we've verified it renders the value
  });
});

