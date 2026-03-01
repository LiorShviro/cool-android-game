import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DogDistraction } from '../components/stations/DogDistraction';

describe('DogDistraction Station', () => {
  it('renders correctly', () => {
    const { getByText } = render(<DogDistraction onSuccess={jest.fn()} />);
    expect(getByText('THROW BALL')).toBeTruthy();
  });

  it('should trigger onSuccess after 4 taps', () => {
    const mockOnSuccess = jest.fn();
    const { getByTestId } = render(<DogDistraction onSuccess={mockOnSuccess} />);
    const ball = getByTestId('dog-ball');

    fireEvent.press(ball);
    fireEvent.press(ball);
    fireEvent.press(ball);
    expect(mockOnSuccess).not.toHaveBeenCalled();

    fireEvent.press(ball);
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});

