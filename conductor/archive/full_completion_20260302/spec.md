# Specification: Full Gameplay & Systems Completion

## 1. Overview
This track completes the original vision for "Mamad Manager" by implementing the remaining two gesture-based stations and finalizing the user-facing screens (Tutorial and Leaderboard) with real content and a ranking system.

## 2. Functional Requirements
- **Charging Station (Drag & Drop):**
    - A dangling charging cable (using Reanimated for physics/motion).
    - A moving smartphone with a clear charging port area.
    - Player must drag the cable end into the port area.
    - Fulfills the "CHARGING" need for Adults.
- **Reception Hunter (Sweet Spot):**
    - A character holds a phone; the player must swipe their hand horizontally.
    - A hidden "sweet spot" area (randomized) provides 3 bars of reception.
    - Player must find and hold the hand in the sweet spot for 2 seconds.
    - Fulfills the "RECEPTION" need for Adults.
- **Detailed Tutorial:**
    - Step-by-step guide explaining all 5 stations (Water, Snacks, Dog, Charging, Reception).
    - Clear visual icons/placeholders representing each action.
    - Explanation of the Rocket life system and Stress Meter.
- **Leaderboard Ranks:**
    - High scores are awarded titles based on score tiers:
        - 0-500: Mamad Rookie
        - 501-1500: Snack Commander
        - 1501-3000: Safe Room Pro
        - 3001+: Chief of Home Front
    - These ranks are displayed in the leaderboard and on the Game Over screen.

## 3. Technical Requirements
- **State Management (Zustand):**
    - Ensure `fulfillNeed` correctly handles "CHARGING" and "RECEPTION".
- **Gestures (Gesture Handler & Reanimated):**
    - `PanGesture` for Charging Station (Drag & Drop).
    - `PanGesture` for Reception Hunter (Horizontal swipe with "holding" logic).
- **UI Components:**
    - Finalize `TutorialScreen` layout and content.
    - Update `LeaderboardScreen` to show ranks.

## 4. UI/UX
- **Visual Feedback:** 
    - Charging cable "snaps" into place on success.
    - Reception bars animate (0 to 3) as the player swiping.
- **Polish:** Consistent styling across all new stations and screens.
