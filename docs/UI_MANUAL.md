# UI Configuration Manual

This document lists the main UI files and the safest knobs to customize the look and feel of the game.

## Theme Tokens
- `src/assets/theme.ts`
  - Colors, radii, and shared tokens used by all UI components.
  - Prefer updating colors here instead of hardcoding.

## Character Art (PNG)
- PNGs live in `src/assets/png/characters/`.
- File names (snake_case, 3 moods each). Current characters:
  - **ADULT variants:** `saba`, `parent`, `grandma`, `soldier`, `neighbor`
  - **KID variants:** `teen`, `toddler`
  - **PET variants:** `dog`, `cat`
  - Each has `_neutral.png`, `_impatient.png`, `_urgent.png` (plus `@2x`, `@3x`)
- **Adding new variants:** extend `CHARACTER_VARIANTS` in `src/constants/gameConstants.ts`, add the PNG key to `VARIANT_TO_PNG_KEY`, add the new entry to `CharacterPngKey` union and `characterPngs` map in `src/assets/png/characters/index.ts`, and provide the PNG files.
- The `visualKey` field on `Character` (store) stores the resolved PNG key per spawned character. `CharacterAvatar` in `Character.tsx` reads this field.
- PNG mapping is in `src/assets/png/characters/index.ts`.
- Size is controlled in `Character.tsx` via the `avatarSize` calculation.

## Station Art (PNG)
- PNGs live in `src/assets/png/stations/`.
- Required files:
  - `charge_phone.png`, `charge_plug.png`
  - `water_cup_base.png`
  - `snack_bag.png`
  - `dog_ball.png`
  - `reception_hand_phone.png`
- Station PNG mapping is in `src/assets/png/stations/index.ts`.
- Station layouts are in `src/components/stations/` and use `useUIScale()` for responsive sizing.

## PNG Asset Specs
Use transparent backgrounds and draw to the full canvas (leave ~10% padding).

**Characters**
- Canvas ratio: 1 : 1.3 (width : height)
- Suggested sizes:
  - `@1x` 200×260
  - `@2x` 400×520
  - `@3x` 600×780

**Stations**
- Use readable, chunky silhouettes and bold outlines.
- Suggested sizes (per asset):
  - `charge_phone`: 120×160 (@1x)
  - `charge_plug`: 90×120 (@1x)
  - `water_cup_base`: 140×200 (@1x)
  - `snack_bag`: 120×160 (@1x)
  - `dog_ball`: 120×120 (@1x)
  - `reception_hand_phone`: 140×160 (@1x)
- For `@2x` and `@3x`, multiply each dimension by 2 or 3.

**Background**
- `@1x` 1080×1920 (portrait)
- `@2x` 2160×3840
- `@3x` 3240×5760
- Keep empty space near the top for UI overlays (logo, header).

## Background
- Main background PNG: `src/assets/png/backgrounds/mamad_room.png`
  - Optional hi-res: `mamad_room@2x.png`, `mamad_room@3x.png`
- Corridor background PNG: `src/assets/png/backgrounds/corridor.png` (used during Bathroom Break mini-game)
- Background mapping: `src/assets/png/backgrounds/index.ts`
- Background is rendered in `App.tsx` behind all screens.

## Bathroom Break Mini-Game Assets
- Runner PNG: `src/assets/png/obstacles/runner.png` (top-down character, 120×120 @1x)
- Obstacle PNGs: `src/assets/png/obstacles/` — `box`, `chair`, `toy`, `shoe`, `bathroom_door` (each 80×80 @1x)
- Obstacle mapping: `src/assets/png/obstacles/index.ts`
- Component: `src/components/BathroomBreak.tsx`
- Trigger hook: `src/hooks/useBathroomBreakTrigger.ts` — fires every `BATHROOM_BREAK_SCORE_INTERVAL` (2000) points

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
