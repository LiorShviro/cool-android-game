# Mamad Manager (Safe Room Chaos)

**Mamad Manager** is a fast-paced, 2D reflex and time-management game built with React Native. You take on the role of a safe room manager in Israel, juggling the needs of stressed adults, bored kids, and an energetic dog while the siren sounds.

> This is the **public release** branch. Internal planning docs are kept in the `main` branch and are not included here.

## 🚀 Premise
The siren has sounded, the heavy iron door is shut, and now you have to keep everyone inside calm until the Home Front Command gives the all-clear. If the room's overall "Stress Meter" maxes out, it's Game Over!

## 🎮 Core Mechanics
- **Time Management:** Fulfill character needs before their timers expire.
- **Interactive Stations:** Water, Snacks, Dog Distraction, Charging, Reception.
- **Combo Scoring:** Fast fulfillments earn bonus points; chains multiply your score.
- **Haptic Feedback:** Feel the urgency with tactile responses.
- **Local Leaderboard:** Compete for the title of "Chief of Home Front" with saved high scores.

## 🛠 Tech Stack
- **Framework:** React Native (TypeScript)
- **State:** Zustand
- **Animations:** Reanimated
- **Gestures:** Gesture Handler
- **Storage:** MMKV
- **Haptics:** React Native Haptic Feedback

## 📦 Getting Started

### Prerequisites
- Node.js (v22+)
- Android Studio & SDK
- A physical Android device (recommended for haptics) or Emulator

### Installation
```bash
npm install
```

### Running Locally
```bash
npm start
npm run android
```

## 🧪 Testing
```bash
npm test
```

## 🎨 UI Customization
See `UI_MANUAL.md` for where to adjust characters, backgrounds, station sizes, and theme tokens.

## 🤝 Contributing
See `CONTRIBUTING.md`.

## 🔒 Security
See `SECURITY.md`.

---
*Created with the Conductor Methodology.*
