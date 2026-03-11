import React from 'react';
import { LeaderboardEntry, storageService } from '../services/storageService';
import { THEME } from '../assets/theme';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ entries, onBack }) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 60,
      overflow: 'hidden',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 18,
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Title */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: THEME.colors.yellow,
          borderRadius: THEME.borderRadius.large,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 10,
          paddingBottom: 10,
          marginBottom: 20,
          border: `3px solid ${THEME.colors.outline}`,
          gap: 10,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontSize: 24 }}>🏆</span>
          <span style={{ fontSize: 22, fontWeight: 'bold', color: THEME.colors.outline }}>
            LEADERBOARD
          </span>
        </div>

        {/* Header row */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingLeft: 14,
          paddingRight: 14,
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 11, fontWeight: 'bold', color: '#888', letterSpacing: 1, width: 50 }}>RANK</span>
          <span style={{ fontSize: 11, fontWeight: 'bold', color: '#888', letterSpacing: 1, flex: 1 }}>NAME</span>
          <span style={{ fontSize: 11, fontWeight: 'bold', color: '#888', letterSpacing: 1, width: 60, textAlign: 'right' }}>SCORE</span>
        </div>

        {/* Entries list */}
        <div style={{ width: '100%', flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
          {entries.length === 0 ? (
            <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 36, marginBottom: 8 }}>🎮</span>
              <span style={{ color: '#999', fontSize: 16 }}>No scores yet. Go play!</span>
            </div>
          ) : (
            entries.map((item, index) => {
              const isTop3 = index < 3;
              const rowBg = index === 0 ? '#FFF3CC' : index === 1 ? '#F5F5F5' : index === 2 ? '#FFF0E8' : THEME.colors.offWhite;
              return (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  padding: 12,
                  borderRadius: THEME.borderRadius.medium,
                  marginBottom: 8,
                  alignItems: 'center',
                  backgroundColor: rowBg,
                  border: `${isTop3 ? 2.5 : 2}px solid ${THEME.colors.outline}`,
                  boxShadow: isTop3 ? '0 2px 6px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                  {/* Rank */}
                  <div style={{ width: 50, display: 'flex', justifyContent: 'center' }}>
                    {isTop3 ? (
                      <span style={{ fontSize: 24 }}>{MEDALS[index]}</span>
                    ) : (
                      <span style={{ fontSize: 18, fontWeight: 'bold', color: '#888' }}>{index + 1}</span>
                    )}
                  </div>
                  {/* Name + rank title */}
                  <div style={{ flex: 1, paddingLeft: 8 }}>
                    <div style={{ fontSize: 15, color: THEME.colors.outline, fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: '#888', fontWeight: '600' }}>{storageService.getRank(item.score)}</div>
                  </div>
                  {/* Score */}
                  <div style={{ width: 60, textAlign: 'right' }}>
                    <span style={{
                      fontSize: isTop3 ? 20 : 18,
                      fontWeight: 'bold',
                      color: isTop3 ? THEME.colors.orange : THEME.colors.outline,
                    }}>
                      {item.score}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onBack}
          style={{
            backgroundColor: THEME.colors.orange,
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 50,
            paddingRight: 50,
            borderRadius: THEME.borderRadius.pill,
            marginTop: 16,
            marginBottom: 20,
            border: `2.5px solid ${THEME.colors.outline}`,
            color: 'white',
            fontSize: 17,
            fontWeight: 'bold',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          BACK
        </button>
      </div>
    </div>
  );
};
