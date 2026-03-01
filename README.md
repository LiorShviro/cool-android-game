# Mamad Manager (Safe Room Chaos)

**Mamad Manager** is a fast-paced, 2D reflex and time-management game built with React Native. You take on the role of a safe room manager in Israel, juggling the needs of stressed adults, bored kids, and an energetic dog while the siren sounds.

## 🚀 Premise
The siren has sounded, the heavy iron door is shut, and now you have to keep everyone inside calm until the Home Front Command gives the all-clear. If the room's overall "Stress Meter" maxes out, it's Game Over!

## 🎮 Core Mechanics
- **Time Management:** Fulfill character needs before their timers expire (ADULT 20s, KID 14s, DOG 10s).
- **Cartoonish Characters:** Emoji avatars (👨/👩/👦/👧/🐕) with speech bubbles showing their need, and an animated timer bar that shifts green → yellow → red.
- **Interactive Stations:**
  - 💧 **Water Pitcher:** Hold to fill, release in the sweet spot (65–120%).
  - 🥨 **Snack Sorter:** Swipe left (Bisli) or right (Bamba) to sort snacks.
  - 🎾 **Dog Distraction:** Tap the ball 3 times to throw it for the dog.
  - 🔋 **Charging Station:** Drag the plug onto the moving phone to charge it.
  - 📶 **Reception Hunter:** Slide your hand to find the sweet spot and hold for 1s.
- **Combo Scoring:** Fast fulfillments earn bonus points; chains multiply your score.
- **Haptic Feedback:** Feel the urgency with tactile responses for warnings and mistakes.
- **Local Leaderboard:** Compete for the title of "Chief of Home Front" with saved high scores.

## 🛠 Tech Stack
- **Framework:** [React Native](https://reactnative.dev/) (TypeScript)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Gestures:** [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **Storage:** [MMKV](https://github.com/mrousavy/react-native-mmkv)
- **Haptics:** [React Native Haptic Feedback](https://github.com/mkuczera/react-native-haptic-feedback)

## 📦 Getting Started

### Prerequisites
- Node.js (v22+)
- Android Studio & SDK
- A physical Android device (recommended for haptics) or Emulator

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the Metro bundler:
   ```bash
   npm start
   ```
2. Launch on Android:
   ```bash
   npm run android
   ```

## 🧪 Testing
We use Jest and React Native Testing Library for robust logic and component verification.
```bash
npm test
```

## 🤖 CI/CD
This project uses **GitHub Actions** to automatically build and version Android APKs on every push to `main`.
- Download the latest build from the **Actions** tab in GitHub.
- Look for the `MamadManager-v1.0.x` artifact.

---
*Created with the Conductor Methodology.*
