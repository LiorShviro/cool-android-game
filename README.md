# MelechHaMamad (Safe Room Chaos)

**MelechHaMamad** is a fast-paced, 2D reflex and time-management game built with React Native. You take on the role of a safe room manager in Israel, juggling the needs of stressed adults, bored kids, and an energetic dog while the siren sounds.

## 🚀 Premise
The siren has sounded, the heavy iron door is shut, and now you have to keep everyone inside calm until the Home Front Command gives the all-clear. If the room's overall "Stress Meter" maxes out, it's Game Over!

## 📲 Install APK (v3)
Latest APK locations:
- `MelechHaMamad.apk` (latest build, root)
- `releases/version3.apk` (versioned copy)

### Install on Android
1. Transfer `MelechHaMamad.apk` (or `releases/version3.apk`) to your device.
2. Enable **Install unknown apps** for your file manager (Android Settings → Security).
3. Tap the APK to install.

## 🎮 How to Play
- **Time Management:** ⏱️ Fulfill character needs before their timers expire (ADULT 20s, KID 14s, DOG 10s).
- **Characters:** 🗣️ 9 character variants across 3 types — Saba, Parent, Grandma, Soldier, Neighbor (ADULT), Teen, Toddler (KID), Dog, Cat (PET). Each spawns with a randomly selected visual variant.
- **Interactive Stations:**
  - **Water Pitcher:** 💧 Hold to fill, release in the sweet spot (65–120%).
  - **Snack Sorter:** 🥨 Swipe left (Bisli) or right (Bamba) to sort snacks.
  - **Dog Distraction:** 🎾 Tap the ball 3 times to throw it for the dog.
  - **Charging Station:** 🔌 Drag the plug onto the moving phone to charge it.
  - **Reception Hunter:** 📶 Slide your hand to find the sweet spot and hold for 1s.
- **Bathroom Break (mini-game):** 🚽 Every 2000 points, gameplay pauses for a 15-second vertical runner. Swipe left/right to dodge falling obstacles in a corridor. Survive = **+500 bonus points**!
- **Harder Difficulty:** Spawn interval and character timers now scale more aggressively. At 5000 points, a 5th character slot opens.
- **Combo Scoring:** 🔥 Fast fulfillments earn bonus points; chains multiply your score.
- **Haptic Feedback:** 📳 Feel the urgency with tactile responses for warnings and mistakes.
- **Local Leaderboard:** 🏆 Compete for the title of "Chief of Home Front" with saved high scores.

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

## 📲 Install APK (v3)
Latest APK locations:
- `versions_apk/version3.apk` (versioned build)
- `MelechHaMamad.apk` (convenience copy at repo root)

### Install on Android
1. Transfer `versions_apk/version3.apk` or `MelechHaMamad.apk` to your device.
2. Enable **Install unknown apps** for your file manager (Android Settings → Security).
3. Tap the APK to install.

## 🤖 CI/CD
This project uses **GitHub Actions** to automatically build and version Android APKs on every push to `main`.
- Download the latest build from the **Actions** tab in GitHub.
- Look for the `MelechHaMamad-v1.0.x` artifact.

> Note: The local APKs above may be newer than the Actions artifact if you built locally.

---
*Created with the Conductor Methodology.*
