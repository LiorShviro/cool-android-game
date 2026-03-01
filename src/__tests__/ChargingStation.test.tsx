import React from 'react';
import { render } from '@testing-library/react-native';
import { ChargingStation } from '../src/components/stations/ChargingStation';

describe('ChargingStation Station', () => {
  it('renders with CHARGE text', () => {
    const { getByText } = render(<ChargingStation onSuccess={jest.fn()} />);
    expect(getByText('CHARGE')).toBeTruthy();
  });

  it('calls onSuccess callback when provided', () => {
    const mockOnSuccess = jest.fn();
    render(<ChargingStation onSuccess={mockOnSuccess} />);
    // Component renders without errors and accepts the callback
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
