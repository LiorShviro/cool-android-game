import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TutorialScreen } from '../components/TutorialScreen';

describe('TutorialScreen', () => {
  it('renders instructions correctly', () => {
    const { getByText } = render(<TutorialScreen onBack={jest.fn()} />);
    expect(getByText(/HOW TO PLAY/)).toBeTruthy();
    expect(getByText(/Water Pitcher/)).toBeTruthy();
    expect(getByText(/Snack Sorter/)).toBeTruthy();
    expect(getByText(/Dog Distraction/)).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const mockOnBack = jest.fn();
    const { getByText } = render(<TutorialScreen onBack={mockOnBack} />);
    fireEvent.press(getByText('BACK'));
    expect(mockOnBack).toHaveBeenCalled();
  });
});
