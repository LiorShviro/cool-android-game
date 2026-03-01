import { hapticService } from '../src/services/hapticService';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Mock the library
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

describe('Haptic Service', () => {
  it('should trigger light impact', () => {
    hapticService.light();
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactLight', expect.anything());
  });

  it('should trigger medium impact', () => {
    hapticService.medium();
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactMedium', expect.anything());
  });

  it('should trigger heavy impact', () => {
    hapticService.heavy();
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactHeavy', expect.anything());
  });

  it('should trigger success notification', () => {
    hapticService.success();
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('notificationSuccess', expect.anything());
  });

  it('should trigger warning notification', () => {
    hapticService.warning();
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('notificationWarning', expect.anything());
  });

  it('should trigger notification error on mistakes', () => {
    hapticService.error();
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('notificationError', expect.anything());
  });
});
