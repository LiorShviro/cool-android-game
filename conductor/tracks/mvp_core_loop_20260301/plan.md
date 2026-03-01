# Implementation Plan: MVP Core Gameplay Loop

## Phase 1: Project Scaffolding & State Management [checkpoint: 9f286b9]
- [x] Task: Initialize React Native project with TypeScript and install dependencies (Zustand, Reanimated, MMKV). (3b4e537)
- [x] Task: Set up the global game store using Zustand (Stress Meter, Game State, Active Characters). (e308cdc)
    - [x] Define the `GameState` (START, PLAYING, GAME_OVER).
    - [x] Create actions to update Stress Meter and spawn/remove characters.
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) (9f286b9)

## Phase 2: Core Game Loop & Character Spawning [checkpoint: 78d0816]
- [x] Task: Implement the `CharacterManager` component to handle spawning logic. (515a409)
    - [x] Define character types (Adult, Kid, Dog) and their specific timer durations. (515a409)
    - [x] Create the visual `Character` component with a Reanimated timer bubble. (243d321)
- [x] Implement the `OverallStressMeter` component. (bd333d6)
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) (78d0816)

## Phase 3: Action Stations Implementation [checkpoint: 1bd274e]
- [x] Task: Implement the `WaterPitcher` station. (c013b24)
    - [x] Add Touch & Hold interaction logic. (c013b24)
    - [x] Add precision release validation and 3s lock on failure. (c013b24)
- [x] Task: Implement the `SnackSorter` station. (b97dac8)
    - [x] Add Left/Right swipe interaction logic. (b97dac8)
    - [x] Link snack delivery to character need fulfillment. (b97dac8)
- [x] Task: Implement the `DogDistraction` station. (caae30f)
    - [x] Add rapid tapping logic on a bouncing ball element. (caae30f)
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) (1bd274e)

## Phase 4: Integration & Game Over State
- [ ] Task: Link the action stations to character needs.
- [ ] Task: Implement the `GameOver` screen and basic local leaderboard with MMKV.
- [ ] Task: Add haptic feedback for timer warnings and mistakes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
