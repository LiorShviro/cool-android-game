# Repository Guidelines

## Project Structure & Module Organization
- `App.tsx` is the React Native entry point and screen router.
- `src/` contains game code: `components/`, `hooks/`, `services/`, `store/`, and `constants/`.
- `src/assets/` holds SVG art, theme tokens, and other static assets.
- Tests live in `src/__tests__/`.
- Platform code lives in `android/` and `ios/`.
- Product and architecture docs are in `conductor/`.

## Build, Test, and Development Commands
- `npm install` installs dependencies (requires Node >= 22.11.0).
- `npm start` launches the Metro bundler.
- `npm run android` builds and runs the Android app on a device/emulator.
- `npm run ios` builds and runs the iOS app.
- `npm test` runs the full Jest test suite.
- `npx jest src/__tests__/gameStore.test.ts` runs a single test file.
- `npm run lint` runs ESLint.
- `cd android && ./gradlew assembleRelease` builds a release APK.

## Coding Style & Naming Conventions
- TypeScript is required for app code.
- Indentation: 2 spaces. Strings: single quotes. Semicolons are explicit.
- Named exports only; avoid default exports.
- Prefer `const`/`let` only; avoid `var` and `any`.
- Naming: `lowerCamelCase` for variables/functions, `UpperCamelCase` for components/types, `CONSTANT_CASE` for constants. Components and screens use `PascalCase` filenames (e.g., `CharacterManager.tsx`).
- Linting uses `@react-native/eslint-config` via `npm run lint`.

## Testing Guidelines
- Frameworks: Jest + `@testing-library/react-native`, with native modules mocked in `jest.setup.js`.
- Place tests in `src/__tests__/` and name them `*.test.ts` or `*.test.tsx`.
- There is no fixed coverage threshold; add/adjust tests when changing game logic, store behavior, or UI state transitions.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits with optional scopes, e.g. `feat(ui): add leaderboard ranks` or `fix(storage): lazy-init MMKV`.
- Keep subjects short and imperative.
- PRs should include a clear summary, testing notes, and screenshots or screen recordings for UI changes. Link related issues when applicable.

## Configuration Notes
- Android builds assume JDK 17 and the configured Android SDK/NDK (see `android/` and `conductor/tech-stack.md`).
