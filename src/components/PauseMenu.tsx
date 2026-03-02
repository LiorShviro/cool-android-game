import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useGameStore, GameState } from '../store/gameStore';
import { THEME } from '../assets/theme';

export const PauseMenu: React.FC = () => {
  const { isPaused, togglePause, setGameState, reset } = useGameStore();

  const handleQuit = () => {
    reset();
    setGameState(GameState.START);
  };

  return (
    <Modal
      transparent
      visible={isPaused}
      animationType="fade"
      onRequestClose={togglePause}
    >
      <View style={styles.overlay}>
        <View style={styles.menuContainer}>
          {/* Title badge */}
          <View style={styles.titleBadge}>
            <Text style={styles.pauseIcon}>⏸</Text>
            <Text style={styles.title}>GAME PAUSED</Text>
          </View>

          <Text style={styles.flavorText}>Taking a breather in the Mamad...</Text>

          <TouchableOpacity style={styles.resumeButton} onPress={togglePause}>
            <Text style={styles.buttonText}>RESUME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
            <Text style={styles.quitButtonText}>QUIT TO MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '82%',
    backgroundColor: THEME.colors.wall,
    borderRadius: THEME.borderRadius.large,
    padding: 28,
    alignItems: 'center',
    elevation: 12,
    borderWidth: 3,
    borderColor: THEME.colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.orange,
    borderRadius: THEME.borderRadius.medium,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
    gap: 10,
  },
  pauseIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  flavorText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  resumeButton: {
    backgroundColor: THEME.colors.green,
    width: '100%',
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.pill,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
    elevation: 3,
  },
  quitButton: {
    backgroundColor: THEME.colors.offWhite,
    width: '100%',
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.pill,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  quitButtonText: {
    color: THEME.colors.outline,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
