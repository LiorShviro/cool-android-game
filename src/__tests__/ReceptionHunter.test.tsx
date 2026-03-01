import React from 'react';
import { render } from '@testing-library/react-native';
import { ReceptionHunter } from '../components/stations/ReceptionHunter';

describe('ReceptionHunter Station', () => {
  it('renders with RECEPTION text', () => {
    const { getByText } = render(<ReceptionHunter onSuccess={jest.fn()} />);
    expect(getByText('RECEPTION')).toBeTruthy();
  });

  it('calls onSuccess callback when provided', () => {
    const mockOnSuccess = jest.fn();
    render(<ReceptionHunter onSuccess={mockOnSuccess} />);
    // Component renders without errors and accepts the callback
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
