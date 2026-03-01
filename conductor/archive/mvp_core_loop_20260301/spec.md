# Specification: MVP Core Gameplay Loop

## 1. Overview
The MVP focuses on the core "Safe Room Manager" experience, implementing the foundational game loop where characters appear with needs that must be met using specific interactive stations before a timer expires.

## 2. Functional Requirements
- **Character Spawning:** A system to spawn "Adult," "Kid," and "Dog" characters at the top of the screen.
- **Individual Timers:** Each character has a visual "thought bubble" timer that changes color (Green -> Yellow -> Red) as time runs out.
- **Overall Stress Meter:** A global thermometer gauge that increases when character timers expire and leads to a "Game Over" state at 100%.
- **Action Stations (MVP):**
    - **Water Pitcher:** Touch & Hold interaction with precise release timing.
    - **Snack Sorter:** Quick Left/Right swipes to deliver Bamba or Bisli.
    - **Dog Distraction:** Rapid tapping on a bouncing ball to quiet the barking dog.
- **Game State Management:** Transition between Start, Playing, and Game Over states.

## 3. Technical Requirements
- **Framework:** React Native (TypeScript).
- **State Management:** Zustand (handling timers, stress levels, and active needs).
- **Animations:** React Native Reanimated for smooth character movement and station interactions.
- **Storage:** MMKV for local high score tracking.

## 4. UI/UX
- **Screen Layout:** 
    - Top 50%: Character area (spawning zone).
    - Bottom 50%: Interactive station area.
    - Top Overlay: Overall Stress Meter.
- **Visual Feedback:** Haptic feedback on errors/timer warnings.
