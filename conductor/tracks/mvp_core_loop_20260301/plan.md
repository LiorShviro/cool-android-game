# Implementation Plan: MVP Core Gameplay Loop

## Phase 1: Project Scaffolding & State Management
- [x] Task: Initialize React Native project with TypeScript and install dependencies (Zustand, Reanimated, MMKV). (3b4e537)
- [ ] Task: Set up the global game store using Zustand (Stress Meter, Game State, Active Characters).
    - [ ] Define the `GameState` (START, PLAYING, GAME_OVER).
    - [ ] Create actions to update Stress Meter and spawn/remove characters.
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Core Game Loop & Character Spawning
- [ ] Task: Implement the `CharacterManager` component to handle spawning logic.
    - [ ] Define character types (Adult, Kid, Dog) and their specific timer durations.
    - [ ] Create the visual `Character` component with a Reanimated timer bubble.
- [ ] Task: Implement the `OverallStressMeter` component.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Action Stations Implementation
- [ ] Task: Implement the `WaterPitcher` station.
    - [ ] Add Touch & Hold interaction logic.
    - [ ] Add precision release validation and 3s lock on failure.
- [ ] Task: Implement the `SnackSorter` station.
    - [ ] Add Left/Right swipe interaction logic.
    - [ ] Link snack delivery to character need fulfillment.
- [ ] Task: Implement the `DogDistraction` station.
    - [ ] Add rapid tapping logic on a bouncing ball element.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: Integration & Game Over State
- [ ] Task: Link the action stations to character needs.
- [ ] Task: Implement the `GameOver` screen and basic local leaderboard with MMKV.
- [ ] Task: Add haptic feedback for timer warnings and mistakes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
