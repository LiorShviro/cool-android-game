# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mamad Manager** (Safe Room Chaos) — a React Native (TypeScript) casual mobile game for Android. The player manages a crowded Israeli safe room ("Mamad"), fulfilling the needs of adults, kids, and a dog via gesture-based action stations while keeping the overall Stress Meter below 100%.

## Build & Development Commands

```bash
# Install dependencies (requires Node >= 22.11.0)
npm install

# Start Metro bundler
npm start

# Build and run on Android device/emulator
npm run android

# Run all tests
npm test

# Run a single test file
npx jest __tests__/gameStore.test.ts

# Lint
npm run lint

# Android release APK (from project root)
cd android && ./gradlew assembleRelease
```

**Android build requirements:** JDK 17, Android SDK (compileSdk 36, minSdk 24), NDK 27.1.12297006.

## Architecture

### State Management
Zustand store in `src/store/gameStore.ts` is the single source of truth. It manages:
- Game state machine: `START` → `PLAYING` → `GAME_OVER`
- Character lifecycle (spawn, timer expiry, need fulfillment)
- Stress meter (0–100%, +10 on timeout penalty, -5 on need fulfilled)
- Score tracking

### Component Structure
- `App.tsx` — Entry point, renders screens based on game state
- `src/components/Character.tsx` — Individual character with animated timer bubble (green→yellow→red via Reanimated)
- `src/components/CharacterManager.tsx` — Spawns characters using `useCharacterManager` hook (3s intervals, max 4 on screen)
- `src/components/OverallStressMeter.tsx` — Global stress bar visualization
- **Action Stations** (each a distinct gesture mini-game):
  - `WaterPitcher.tsx` — Touch & hold, release at 80-110% fill
  - `SnackSorter.tsx` — Swipe left (Bisli) / right (Bamba)
  - `DogDistraction.tsx` — Rapid tap detection

### Services
- `src/services/hapticService.ts` — Device vibration (light/medium/heavy, success/warning/error)
- `src/services/storageService.ts` — MMKV-based persistent leaderboard (top 10)

### Game Constants
`src/constants/gameConstants.ts` defines character types and timers:
- ADULT: 15s timer, needs water/charging/reception
- KID: 10s timer, needs Bamba/Bisli
- DOG: 7s timer, needs petting

## Key Libraries
- **Zustand** — State management
- **React Native Reanimated** — High-performance animations
- **React Native Gesture Handler** — Touch gesture detection
- **React Native MMKV** — Local persistent storage
- **React Native Haptic Feedback** — Tactile responses

## Testing
Tests live in `__tests__/` and use Jest + `@testing-library/react-native`. Native libraries (MMKV, Haptic Feedback, Reanimated, PanResponder) are mocked.

## TypeScript Style
Follows Google TypeScript Style Guide (see `conductor/code_styleguides/typescript.md`):
- Named exports only (no default exports)
- `const`/`let` only (no `var`)
- Avoid `any` — prefer `unknown` or specific types
- No `_` prefix/suffix on identifiers
- Single quotes, explicit semicolons
- `lowerCamelCase` for variables/functions, `UpperCamelCase` for types/classes, `CONSTANT_CASE` for constants

## Project Documentation
The `conductor/` directory contains product specs, tech stack decisions, style guides, and development track history. Refer to `conductor/product.md` for full game design and `conductor/tech-stack.md` for technology choices.
