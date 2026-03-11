# Web Port Plan — MelechHaMamad

## Goal
Port the React Native Android game to a web app that:
- Runs on GitHub Pages
- Works offline (PWA with service worker)
- Supports mouse + touch controls

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React + Vite |
| Animations | Framer Motion |
| Gestures | @use-gesture/react |
| Storage | localStorage (replaces MMKV) |
| State | Zustand (reuse as-is) |
| PWA/Offline | vite-plugin-pwa |
| Deploy | gh-pages → GitHub Pages |

## Directory: `web/`

```
web/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── public/
│   └── assets/           ← all PNGs copied here
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── store/gameStore.ts          ← reuse as-is (Zustand)
    ├── constants/gameConstants.ts  ← reuse as-is
    ├── services/storageService.ts  ← rewrite: localStorage
    ├── services/hapticService.ts   ← rewrite: navigator.vibrate()
    ├── hooks/
    │   ├── useUIScale.ts           ← rewrite: window.innerWidth
    │   ├── useCharacterManager.ts  ← reuse as-is
    │   └── useSupplyRunTrigger.ts  ← reuse as-is
    ├── components/
    │   ├── Character.tsx
    │   ├── GameHUD.tsx
    │   ├── ComboPopup.tsx
    │   ├── PauseMenu.tsx
    │   ├── TutorialScreen.tsx
    │   ├── LeaderboardScreen.tsx
    │   ├── SupplyRun.tsx
    │   └── stations/
    │       ├── WaterPitcher.tsx
    │       ├── SnackSorter.tsx
    │       ├── DogDistraction.tsx
    │       ├── ChargingStation.tsx
    │       └── ReceptionHunter.tsx
    └── assets/
        ├── theme.ts                ← reuse as-is
        ├── characters/index.ts     ← URL paths instead of require()
        ├── stations/index.ts       ← URL paths instead of require()
        └── backgrounds/index.ts    ← URL paths instead of require()
```

## Translation Guide

| React Native | Web |
|---|---|
| `<View>` | `<div>` |
| `<Text>` | `<span>` |
| `<Image source={require(...)}/>` | `<img src="/assets/..."/>` |
| `<TouchableOpacity onPress>` | `<button onClick>` |
| `<ScrollView horizontal>` | `<div style={{overflowX:'auto'}}>` |
| `StyleSheet.create({})` | inline style objects |
| `useSharedValue` + `useAnimatedStyle` | Framer Motion `motion.div` + `animate` |
| `withTiming/withSpring` | Framer Motion transitions |
| `PanResponder` / `Gesture.Pan()` | `@use-gesture/react` `useDrag()` |
| `MMKV` | `localStorage` |
| `HapticFeedback` | `navigator.vibrate()` |
| `useWindowDimensions` | `window.innerWidth/innerHeight` |
| `SafeAreaView` | CSS padding |
| `Modal` | absolute-positioned div overlay |

## Reused as-is
- `gameStore.ts` — Zustand, fully web-compatible
- `gameConstants.ts` — pure data
- `useCharacterManager.ts` — pure hooks
- `useSupplyRunTrigger.ts` — pure logic
- `theme.ts` — just color values
- All PNG assets (different import mechanism)

## Implementation Phases

### Phase 1 — Scaffold & Core Logic ✅
1. Create `web/` with Vite + React + TypeScript
2. Copy/adapt: gameStore, gameConstants, hooks, theme
3. Rewrite: storageService, hapticService, useUIScale
4. Copy all PNGs to `web/public/assets/`
5. Asset index files using URL strings

### Phase 2 — Screens & Layout
1. Port App.tsx (all screens)
2. Port GameHUD, PauseMenu, TutorialScreen, LeaderboardScreen

### Phase 3 — Characters
1. Port Character.tsx with Framer Motion bob + timer bar

### Phase 4 — Stations (gesture-heavy)
1. Port all 5 station components using @use-gesture/react

### Phase 5 — Supply Run
1. Port SupplyRun.tsx

### Phase 6 — PWA & Offline
1. vite-plugin-pwa with service worker
2. manifest.json
3. Pre-cache all assets

### Phase 7 — GitHub Pages Deploy
1. `base: '/cool-android-game/'` in vite.config.ts
2. `gh-pages` deploy script

## GitHub Pages URL
`https://<username>.github.io/cool-android-game/`
