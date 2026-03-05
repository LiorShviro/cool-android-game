# UI Configuration Manual

This document lists the main UI files and the safest knobs to customize the look and feel of the game.

## Theme Tokens
- `src/assets/theme.ts`
  - Colors, radii, and shared tokens used by all UI components.
  - Prefer updating colors here instead of hardcoding.

## Character Art (PNG)
- PNGs live in `src/assets/png/characters/`.
- File names (snake_case, 3 moods each):
  - `saba_neutral.png`, `saba_impatient.png`, `saba_urgent.png`
  - `parent_neutral.png`, `parent_impatient.png`, `parent_urgent.png`
  - `teen_neutral.png`, `teen_impatient.png`, `teen_urgent.png`
  - `dog_neutral.png`, `dog_impatient.png`, `dog_urgent.png`
- Character selection logic is in `src/components/Character.tsx` (see `CharacterAvatar`).
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
- Background mapping: `src/assets/png/backgrounds/index.ts`
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
