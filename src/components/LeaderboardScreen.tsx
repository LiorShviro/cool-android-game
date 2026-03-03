import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LeaderboardEntry, storageService } from '../services/storageService';
import { THEME } from '../assets/theme';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ entries, onBack }) => {
  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isTop3 = index < 3;
    const rowBg = index === 0 ? '#FFF3CC' : index === 1 ? '#F5F5F5' : index === 2 ? '#FFF0E8' : THEME.colors.offWhite;

    return (
      <View style={[styles.entry, isTop3 && styles.topEntry, { backgroundColor: rowBg }]}>
        <View style={styles.rankCell}>
          {isTop3 ? (
            <Text style={styles.medal}>{MEDALS[index]}</Text>
          ) : (
            <Text style={styles.rankNumber}>{index + 1}</Text>
          )}
        </View>
        <View style={styles.nameCell}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.rankTitle}>{storageService.getRank(item.score)}</Text>
        </View>
        <View style={styles.scoreCell}>
          <Text style={[styles.score, isTop3 && styles.topScore]}>{item.score}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleBadge}>
          <Text style={styles.titleIcon}>🏆</Text>
          <Text style={styles.titleText}>LEADERBOARD</Text>
        </View>

        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, { width: 50 }]}>RANK</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>NAME</Text>
          <Text style={[styles.headerText, { width: 60, textAlign: 'right' }]}>SCORE</Text>
        </View>

        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          style={styles.flatList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎮</Text>
              <Text style={styles.emptyText}>No scores yet. Go play!</Text>
            </View>
          }
        />

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 18,
    alignItems: 'center',
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.yellow,
    borderRadius: THEME.borderRadius.large,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: THEME.colors.outline,
    elevation: 4,
    gap: 10,
  },
  titleIcon: {
    fontSize: 24,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.colors.outline,
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888',
    letterSpacing: 1,
  },
  flatList: {
    width: '100%',
  },
  list: {
    width: '100%',
    paddingBottom: 8,
  },
  entry: {
    flexDirection: 'row',
    width: '100%',
    padding: 12,
    borderRadius: THEME.borderRadius.medium,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: THEME.colors.outline,
  },
  topEntry: {
    borderWidth: 2.5,
    elevation: 4,
  },
  rankCell: {
    width: 50,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  medal: {
    fontSize: 24,
  },
  nameCell: {
    flex: 1,
    paddingLeft: 8,
  },
  name: {
    fontSize: 15,
    color: THEME.colors.outline,
    fontWeight: 'bold',
  },
  rankTitle: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
  },
  scoreCell: {
    width: 60,
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.colors.outline,
  },
  topScore: {
    color: THEME.colors.orange,
    fontSize: 20,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: THEME.colors.orange,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: THEME.borderRadius.pill,
    marginTop: 16,
    marginBottom: 20,
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
