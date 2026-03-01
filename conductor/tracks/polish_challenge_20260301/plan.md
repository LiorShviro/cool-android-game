# Implementation Plan: Game Polish & Challenge (v1.0)

## Phase 1: Life System & State Updates [checkpoint: 7272578]
- [x] Task: Update the `gameStore` state and actions. (2531c0c)
    - [x] Add `lives` (default 3), `score`, `comboMultiplier`, and `isPaused`. (2531c0c)
    - [x] Add `togglePause`, `incrementScore`, and `decrementLives` actions. (2531c0c)
- [x] Task: Update the `Character` component timer logic to use `decrementLives` on expiration. (2531c0c)
- [x] Task: Create a `RocketHUD` component to display the 3 rocket life indicators. (2531c0c)
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) (7272578)

## Phase 2: Difficulty Scaling & Combos
- [ ] Task: Implement dynamic spawn calculation in `useCharacterManager` based on current score.
- [ ] Task: Implement combo logic in `gameStore` (success increments, failure resets).
- [ ] Task: Create a `ComboPopup` animation using Reanimated to show "x2", "x3" when successful.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Pause System & Navigation
- [ ] Task: Implement a `PauseMenu` overlay component.
- [ ] Task: Add a Pause button to the gameplay HUD.
- [ ] Task: Update `Character` timers and `CharacterManager` spawning to respect the `isPaused` state.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: Main Menu Extensions (Tutorial & Leaderboard)
- [ ] Task: Refactor `App.tsx` navigation to support different menu views (MENU, PLAYING, TUTORIAL, LEADERBOARD, GAME_OVER).
- [ ] Task: Implement the `TutorialScreen` component.
- [ ] Task: Implement the dedicated `LeaderboardScreen` component (full history).
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
