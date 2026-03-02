import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useGameStore, GameState } from '../store/gameStore';

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
          <Text style={styles.title}>GAME PAUSED</Text>
          
          <TouchableOpacity style={styles.button} onPress={togglePause}>
            <Text style={styles.buttonText}>RESUME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.quitButton]} onPress={handleQuit}>
            <Text style={styles.buttonText}>QUIT TO MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#00C851',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  quitButton: {
    backgroundColor: '#ffbb33',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
