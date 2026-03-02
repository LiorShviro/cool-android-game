import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { LeaderboardEntry, storageService } from '../services/storageService';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ entries, onBack }) => {
  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => (
    <View style={styles.entry}>
      <View style={styles.rankInfo}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
        <Text style={styles.rankTitle}>{storageService.getRank(item.score)}</Text>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>LEADERBOARD</Text>
        
        <View style={styles.header}>
          <Text style={styles.headerText}>RANK</Text>
          <Text style={[styles.headerText, { flex: 1, marginLeft: 20 }]}>NAME</Text>
          <Text style={styles.headerText}>SCORE</Text>
        </View>

        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No scores yet. Go play!</Text>
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
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#AAA',
  },
  list: {
    width: '100%',
    flexGrow: 0,
  },
  entry: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rankInfo: {
    width: 100,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C851',
  },
  rankTitle: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#00C851',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
