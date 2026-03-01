# Specification: Game Polish & Challenge (v1.0)

## 1. Overview
This track transforms the "Mamad Manager" MVP into a complete product by introducing a life-based progression system, dynamic difficulty scaling, and improved navigation (Pause, Tutorial, Leaderboard access).

## 2. Functional Requirements
- **Life System (3 Rockets):**
    - The player starts with 3 lives represented by rocket icons.
    - Losing a life: A life is lost whenever a character's timer expires.
    - Game Over: Triggered when lives reach 0.
- **Difficulty Scaling:**
    - As the score increases, the `SPAWN_INTERVAL` decreases (faster spawns).
    - Character timer durations decrease proportionally to make the game more intense.
- **Combo System:**
    - Fulfilling multiple needs in a row without "mistakes" (overfilling, early release, wrong snack) increases a multiplier (x2, x3, etc.).
    - Multiplier resets on any mistake or timer expiration.
- **Pause Menu:**
    - Available only during active gameplay.
    - Options: Resume (return to game) or Quit (return to main menu).
    - Spawning and character timers must freeze while paused.
- **Tutorial Screen:**
    - Selectable from the Main Menu.
    - Simple visual/textual explanation of the five stations and the life system.
- **Leaderboard View:**
    - Dedicated screen selectable from the Main Menu to view the Top 10 persistent scores.

## 3. Technical Requirements
- **State Management (Zustand):**
    - Add `lives`, `score`, `comboMultiplier`, `isPaused`, and `highestCombo` to the store.
    - Ensure actions handle the interdependency between lives and Game Over.
- **Animations (Reanimated):**
    - Rocket "launch/explosion" effect when a life is lost.
    - Multiplier popup animations.
- **UI Logic:**
    - Overlays for Pause and Tutorial.

## 4. UI/UX
- **Rocket Icons:** Distinct "Rocket" SVGs or stylized shapes in the HUD.
- **HUD Update:** Display current score and active multiplier.
- **Menu Overhaul:** Redesign the Start screen to include "Play," "Tutorial," and "Leaderboard" buttons.
