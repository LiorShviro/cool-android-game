import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../assets/theme';
import { STATION_PNGS } from '../assets/png/stations';
import { getCharacterPng } from '../assets/png/characters';

interface TutorialScreenProps {
  onBack: () => void;
}

const sections: { pngSource: ImageSourcePropType; title: string; color: string; body: string }[] = [
  { pngSource: getCharacterPng('saba', 'urgent'), title: 'Goal', color: THEME.colors.orange, body: 'Keep the safe room calm! Fulfill the needs of the people and the dog before their timers run out. If you miss one, you lose a Rocket life. Lose 3 rockets, and it\'s Game Over!' },
  { pngSource: STATION_PNGS.waterCupBase, title: 'Water Pitcher', color: THEME.colors.blue, body: 'Press and hold the button to pour water. Release when the cup is 65–120% full. Don\'t overfill, or the station will lock!' },
  { pngSource: STATION_PNGS.bamba, title: 'Snack Sorter', color: '#FF8C00', body: 'Swipe the snack bag RIGHT for Bamba or LEFT for Bisli to give the kids what they want.' },
  { pngSource: STATION_PNGS.dogBall, title: 'Dog Distraction', color: THEME.colors.greenDark, body: 'The dog is barking! Tap the bouncing tennis ball 3 times quickly to throw it and quiet the dog.' },
  { pngSource: STATION_PNGS.chargePhone, title: 'Charging Station', color: THEME.colors.yellow, body: 'Drag the cable end and drop it into the port of the moving phone to charge it.' },
  { pngSource: STATION_PNGS.receptionHandPhone, title: 'Reception Hunter', color: '#6644BB', body: 'Swipe the hand left and right to find the sweet spot with 3 bars of signal. Hold it there for a moment to send.' },
  { pngSource: STATION_PNGS.bisly, title: 'Combos', color: THEME.colors.red, body: 'Fulfill needs quickly and without mistakes to increase your multiplier and score higher!' },
];

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>HOW TO PLAY</Text>
        </View>

        {sections.map((s, i) => (
          <View key={i} style={[styles.section, { borderLeftColor: s.color }]}>
            <View style={[styles.sectionTopBar, { backgroundColor: s.color }]} />
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBadge, { backgroundColor: s.color }]}>
                <Image source={s.pngSource} style={styles.iconImage} resizeMode="contain" />
              </View>
              <Text style={[styles.sectionTitle, { color: s.color }]}>{s.title}</Text>
            </View>
            <Text style={styles.text}>{s.body}</Text>
          </View>
        ))}

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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 18,
    alignItems: 'center',
  },
  titleBadge: {
    backgroundColor: THEME.colors.orange,
    borderRadius: THEME.borderRadius.large,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: THEME.colors.outline,
    elevation: 4,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    width: '100%',
    backgroundColor: THEME.colors.offWhite,
    padding: 14,
    paddingTop: 0,
    borderRadius: THEME.borderRadius.medium,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    borderLeftWidth: 5,
    borderWidth: 2,
    borderColor: THEME.colors.outline,
    overflow: 'hidden',
  },
  sectionTopBar: {
    height: 4,
    marginHorizontal: -14,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.outline,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
  },
  text: {
    fontSize: 13,
    lineHeight: 20,
    color: '#555',
  },
  backButton: {
    backgroundColor: THEME.colors.orange,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: THEME.borderRadius.pill,
    marginTop: 16,
    marginBottom: 40,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
