import React from 'react';
import { render, act } from '@testing-library/react-native';
import { SnackSorter } from '../components/stations/SnackSorter';

describe('SnackSorter Station', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SnackSorter onSuccess={jest.fn()} />);
    expect(getByText('SNACKS')).toBeTruthy();
  });

  it('should trigger onSuccess with BAMBA on right swipe', () => {
    const mockOnSuccess = jest.fn();
    const { getByTestId } = render(<SnackSorter onSuccess={mockOnSuccess} />);
    const sorter = getByTestId('snack-sorter');
    
    act(() => {
      sorter.props.onResponderRelease({}, { dx: 60 });
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('BAMBA');
  });

  it('should trigger onSuccess with BISLI on left swipe', () => {
    const mockOnSuccess = jest.fn();
    const { getByTestId } = render(<SnackSorter onSuccess={mockOnSuccess} />);
    const sorter = getByTestId('snack-sorter');

    act(() => {
      sorter.props.onResponderRelease({}, { dx: -60 });
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('BISLI');
  });
});

