import { dependencies } from '../../package.json';

describe('Project Dependencies', () => {
  it('should have zustand installed', () => {
    expect(dependencies).toHaveProperty('zustand');
  });

  it('should have react-native-reanimated installed', () => {
    expect(dependencies).toHaveProperty('react-native-reanimated');
  });

  it('should have react-native-mmkv installed', () => {
    expect(dependencies).toHaveProperty('react-native-mmkv');
  });

  it('should have react-native-haptic-feedback installed', () => {
    expect(dependencies).toHaveProperty('react-native-haptic-feedback');
  });
});

