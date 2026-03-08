import React from 'react';
import { render, act } from '@testing-library/react-native';
import { SupplyRun } from '../components/SupplyRun';

describe('SupplyRun', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnComplete.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders announce phase without crashing', () => {
    const { getByTestId } = render(<SupplyRun onComplete={mockOnComplete} />);
    expect(getByTestId('supply-run-announce')).toBeTruthy();
  });

  it('shows announcement text', () => {
    const { getByText } = render(<SupplyRun onComplete={mockOnComplete} />);
    expect(getByText('האזעקה הפסיקה!')).toBeTruthy();
    expect(getByText('מהר! תתפוס את...')).toBeTruthy();
  });

  it('transitions to run phase after 2 seconds', () => {
    const { getByTestId } = render(<SupplyRun onComplete={mockOnComplete} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByTestId('supply-run-game')).toBeTruthy();
  });

  it('shows SUPPLY RUN title during run phase', () => {
    const { getByText } = render(<SupplyRun onComplete={mockOnComplete} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByText('SUPPLY RUN!')).toBeTruthy();
  });

  it('shows bonus points hint during run phase', () => {
    const { getByText } = render(<SupplyRun onComplete={mockOnComplete} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByText('Catch the right item → +500 bonus!')).toBeTruthy();
  });

  it('calls onComplete with caught=false after 13s run (following 2s announce)', () => {
    render(<SupplyRun onComplete={mockOnComplete} />);

    // Advance past announce phase so run phase mounts
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Now advance through the 13s run countdown
    act(() => {
      jest.advanceTimersByTime(13000);
    });

    expect(mockOnComplete).toHaveBeenCalledWith(false);
  });
});
