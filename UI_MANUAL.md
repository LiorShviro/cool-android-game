# UI Configuration Manual

This document lists the main UI files and the safest knobs to customize the look and feel of the game.

## Theme Tokens
- `src/assets/theme.ts`
  - Colors, radii, and shared tokens used by all UI components.
  - Prefer updating colors here instead of hardcoding.

## Character Art
- SVGs live in `src/assets/svg/characters/`:
  - `SabaCharacter.tsx`
  - `ParentCharacter.tsx`
  - `TeenCharacter.tsx`
  - `DogCharacter.tsx`
- Character selection logic is in `src/components/Character.tsx` (see `CharacterAvatar`).
- Size is controlled via the `size` prop passed from `Character.tsx`.

## Station Art
- Station SVGs live in `src/assets/svg/stations/`:
  - `CupSvg.tsx` (Water)
  - `SnackBagSvg.tsx` (Snacks)
  - `TennisBallSvg.tsx` (Dog)
- Station layouts are in `src/components/stations/`.
  - Each station uses `useUIScale()` for responsive sizing.

## Background
- Main background: `src/assets/svg/backgrounds/MamadRoom.tsx`
- Background is rendered in `App.tsx` behind all screens.

## Layout & Sizing
- Responsive scaling hook: `src/hooks/useUIScale.ts`
  - `scale` is derived from screen width (clamped).
  - Character sizes and station sizes scale from this value.
- Station shelf layout: `App.tsx` (`stationArea`, `stationScroll`).
- Character bubble sizes: `src/components/Character.tsx` (scaled styles).

## Common Tweaks (Examples)
- Make characters bigger:
  - Increase base size in `Character.tsx` (`avatarSize`).
- Make station area taller:
  - Increase `stationArea` height in `App.tsx` (scaled layout).
- Change background colors:
  - Update `THEME.colors` in `src/assets/theme.ts`.

If you add new UI assets, keep them in `src/assets/` and wire them through `theme.ts` or the relevant component file.
