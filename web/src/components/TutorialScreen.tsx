import React from 'react';
import { THEME } from '../assets/theme';
import { STATION_PNGS } from '../assets/stations';
import { getCharacterPng } from '../assets/characters';

interface TutorialScreenProps {
  onBack: () => void;
}

const sections: { imgSrc: string; title: string; color: string; body: string }[] = [
  {
    imgSrc: getCharacterPng('saba', 'urgent'),
    title: 'Goal',
    color: THEME.colors.orange,
    body: "Keep the safe room calm! Fulfill the needs of the people and the dog before their timers run out. If you miss one, you lose a Rocket life. Lose 3 rockets, and it's Game Over!",
  },
  {
    imgSrc: STATION_PNGS.waterCupBase,
    title: 'Water Pitcher',
    color: THEME.colors.blue,
    body: "Press and hold the button to pour water. Release when the cup is 65–120% full. Don't overfill, or the station will lock!",
  },
  {
    imgSrc: STATION_PNGS.bamba,
    title: 'Snack Sorter',
    color: '#FF8C00',
    body: 'Swipe the snack bag RIGHT for Bamba or LEFT for Bisli to give the kids what they want.',
  },
  {
    imgSrc: STATION_PNGS.dogBall,
    title: 'Dog Distraction',
    color: THEME.colors.greenDark,
    body: 'The dog is barking! Tap the bouncing tennis ball 3 times quickly to throw it and quiet the dog.',
  },
  {
    imgSrc: STATION_PNGS.chargePhone,
    title: 'Charging Station',
    color: THEME.colors.yellow,
    body: 'Drag the cable end and drop it into the port of the moving phone to charge it.',
  },
  {
    imgSrc: STATION_PNGS.receptionHandPhone,
    title: 'Reception Hunter',
    color: '#6644BB',
    body: 'Swipe the hand left and right to find the sweet spot with 3 bars of signal. Hold it there for a moment to send.',
  },
  {
    imgSrc: STATION_PNGS.bisly,
    title: 'Combos',
    color: THEME.colors.red,
    body: 'Fulfill needs quickly and without mistakes to increase your multiplier and score higher!',
  },
];

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onBack }) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 60,
    }}>
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        touchAction: 'pan-y',
        padding: '18px 16px 60px',
      }}>
        {/* Title */}
        <div style={{
          backgroundColor: THEME.colors.orange,
          borderRadius: THEME.borderRadius.large,
          paddingLeft: 28,
          paddingRight: 28,
          paddingTop: 12,
          paddingBottom: 12,
          marginBottom: 20,
          width: 'fit-content',
          margin: '0 auto 20px',
          border: `3px solid ${THEME.colors.outline}`,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}>
          <span style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}>
            HOW TO PLAY
          </span>
        </div>

        {sections.map((s, i) => (
          <div key={i} style={{
            width: '100%',
            backgroundColor: THEME.colors.offWhite,
            borderRadius: THEME.borderRadius.medium,
            marginBottom: 12,
            border: `2px solid ${THEME.colors.outline}`,
            borderLeft: `5px solid ${s.color}`,
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
          }}>
            {/* Top color bar */}
            <div style={{ height: 4, backgroundColor: s.color, width: '100%' }} />
            <div style={{ padding: '12px 14px' }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: s.color,
                  border: `2px solid ${THEME.colors.outline}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <img src={s.imgSrc} style={{ width: 24, height: 24, objectFit: 'contain' }} alt="" />
                </div>
                <span style={{ fontSize: 17, fontWeight: 'bold', color: s.color, flex: 1 }}>
                  {s.title}
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: '#555' }}>{s.body}</p>
            </div>
          </div>
        ))}

        <button
          onClick={onBack}
          style={{
            backgroundColor: THEME.colors.orange,
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 50,
            paddingRight: 50,
            borderRadius: THEME.borderRadius.pill,
            display: 'block',
            margin: '16px auto 40px',
            border: `2.5px solid ${THEME.colors.outline}`,
            color: 'white',
            fontSize: 17,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          BACK
        </button>
      </div>
    </div>
  );
};
