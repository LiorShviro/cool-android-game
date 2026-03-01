# Tech Stack: Mamad Manager (Safe Room Chaos)

## Primary Framework & Language
The game will be built using:
- **React Native (TypeScript):** For fast, cross-platform 2D development with a single codebase for Android (and potentially iOS later).

## State Management & Logic
- **Zustand:** A small, fast, and scalable state-management solution to handle the game's core logic, including individual character timers, the overall "Stress Meter," and the scoring system.

## Animations & Gestures
- **React Native Reanimated:** A powerful animation library for building high-performance, fluid animations for the five action stations (Hold, Drag & Drop, Continuous Swipe, Quick Swipes, and Rapid Tapping).

## Device Integration & Utilities
- **React Native Haptic Feedback:** (Recommended: Critical for the immersion and the mute-mode accessibility.) To provide immediate tactile responses to player actions.
- **MMKV (Persistent Storage):** For high-performance, local storage of the Top 10 leaderboard and user settings.
