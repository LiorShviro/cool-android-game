import React from 'react';
import { render } from '@testing-library/react-native';
import { ComboPopup } from '../components/ComboPopup';

describe('ComboPopup', () => {
  it('renders correctly with multiplier text', () => {
    const { getByText } = render(<ComboPopup multiplier={2} />);
    expect(getByText('x2 COMBO!')).toBeTruthy();
  });

  it('renders nothing when multiplier is 1', () => {
    const { queryByText } = render(<ComboPopup multiplier={1} />);
    expect(queryByText(/COMBO/)).toBeFalsy();
  });
});
