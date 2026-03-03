# Art Generation Guide

This document explains **what to generate** and **how to generate it** so the PNGs fit the game perfectly.

## Quick Summary
- **Style:** 2010s Flash game vibe, bold outlines, flat colors, slightly goofy.
- **Output:** PNG with transparent background.
- **Sizes:** Follow exact pixel sizes and naming below.
- **Moods:** 3 moods per character (neutral, impatient, urgent).
- **Files:** Drop PNGs into `src/assets/png/` folders.

## Style Checklist (Must Have)
- Thick black outline (consistent across assets).
- Flat colors (minimal gradients).
- Slightly uneven proportions for a funny, drawn feel.
- Readable silhouettes at small size.
- Transparent background.

## Characters (12 PNGs)
**Character types:** `saba`, `parent`, `teen`, `dog`

**Moods:** `neutral`, `impatient`, `urgent`

**Naming format (snake_case):**
- `saba_neutral.png`, `saba_impatient.png`, `saba_urgent.png`
- `parent_neutral.png`, `parent_impatient.png`, `parent_urgent.png`
- `teen_neutral.png`, `teen_impatient.png`, `teen_urgent.png`
- `dog_neutral.png`, `dog_impatient.png`, `dog_urgent.png`

**Sizes:**
- `@1x`: 200×260
- `@2x`: 400×520
- `@3x`: 600×780

**Canvas guidance:**
- Keep ~10% padding around edges to avoid clipping.
- Character should fill ~80–85% height.

## Stations (6 PNGs)
**Required files:**
- `charge_phone.png` (120×160 @1x)
- `charge_plug.png` (90×120 @1x)
- `water_cup_base.png` (140×200 @1x)
- `snack_bag.png` (120×160 @1x)
- `dog_ball.png` (120×120 @1x)
- `reception_hand_phone.png` (140×160 @1x)

**Sizes:**
- `@2x` and `@3x` are 2× and 3× the @1x size.

## Background (Single PNG)
**File:**
- `mamad_room.png`
- `mamad_room@2x.png`
- `mamad_room@3x.png`

**Sizes:**
- `@1x`: 1080×1920
- `@2x`: 2160×3840
- `@3x`: 3240×5760

**Guidance:**
- Keep space near the top for UI overlays (logo/header).
- No characters, no text.

## Recommended Workflow (ChatGPT Images / DALL·E)
1. Generate a **style lock** (one image with 2–3 characters + 1 prop).
2. Use that style as reference for every asset.
3. Export with transparent background.
4. Resize for @2x and @3x.
5. Save using the exact file names.
6. Replace files under `src/assets/png/`.

## Prompts (Copy/Paste)

### Style Lock Prompt
```
A 2010s Flash game style character sheet: three goofy cartoon characters (older man, parent, teen) with thick black outlines, bright flat colors, slightly uneven proportions, playful and funny expressions. Include one simple prop (snack bag) in matching style. Clean white background. 2D vector-like look, not realistic, no gradients, no 3D.
```

### Character Prompt Template
```
Single character, 2010s Flash game style, thick black outlines, flat bright colors, slight asymmetry, goofy and funny. [CHARACTER DESCRIPTION]. Expression: [MOOD]. Full body, centered. Transparent background. 2D vector-like, no 3D, no gradients.
```

**Character descriptions:**
- `saba`: older Israeli grandpa, warm but funny, slightly hunched, big nose, small smile.
- `parent`: adult parent, casual clothing, expressive eyebrows.
- `teen`: teenager with hoodie or T-shirt, earphones, slouchy pose.
- `dog`: small dog, playful but goofy.

**Mood notes:**
- `neutral`: calm face, soft smile.
- `impatient`: raised eyebrows, slight frown.
- `urgent`: wide eyes, open mouth or stressed face.

### Station Prompt Template
```
A single [OBJECT], 2010s Flash game style, thick black outlines, flat bright colors, slightly goofy. Transparent background. 2D vector-like, no 3D, no gradients.
```

### Background Prompt
```
A cozy Israeli safe-room (mamad) interior, 2010s Flash game style, thick black outlines, flat bright colors. Simple walls, blast door, small shelf, some clutter (books, snacks), warm and playful. No characters, no text. 2D vector-like, no gradients, no 3D. Perspective: straight-on, fits a mobile game background.
```

## File Drop Locations
- Characters: `src/assets/png/characters/`
- Stations: `src/assets/png/stations/`
- Backgrounds: `src/assets/png/backgrounds/`

## Final Check
- Confirm all filenames match exactly.
- Confirm transparency.
- Confirm correct @1x/@2x/@3x sizes.
- Run the app and verify visuals scale properly.
