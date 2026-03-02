import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

interface TutorialScreenProps {
  onBack: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>HOW TO PLAY</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Goal</Text>
          <Text style={styles.text}>Keep the safe room calm! Fulfill the needs of the people and the dog before their timers run out. If you miss one, you lose a Rocket life. Lose 3 rockets, and it's Game Over!</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💧 Water Pitcher</Text>
          <Text style={styles.text}>Press and hold the button to pour water. Release it when the cup is 65-120% full. Don't overfill, or the station will lock!</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥨 Snack Sorter</Text>
          <Text style={styles.text}>Swipe the snack bag RIGHT for Bamba or LEFT for Bisli to give the kids what they want.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎾 Dog Distraction</Text>
          <Text style={styles.text}>The dog is barking! Tap the bouncing tennis ball 3 times quickly to throw it and quiet the dog.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔋 Charging Station</Text>
          <Text style={styles.text}>Drag the dangling cable end and drop it directly into the port of the moving phone to charge it.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📶 Reception Hunter</Text>
          <Text style={styles.text}>Swipe the hand left and right to find the 'sweet spot' with 3 bars of signal. Hold it there for a moment to send the message.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Combos</Text>
          <Text style={styles.text}>Fulfill needs quickly and without mistakes to increase your multiplier and get a higher score!</Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#00C851',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#00C851',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
