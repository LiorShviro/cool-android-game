# WIP — Mamad Manager

Running log of completed work and what's next.

---

## Done

### MVP Core Loop (2026-02-xx)
- Zustand store with `START → PLAYING → GAME_OVER` state machine
- Character spawning (ADULT / KID / DOG) with per-type timers and needs
- Stress meter (0–100%), game over when maxed
- 3 original stations: WaterPitcher, SnackSorter, DogDistraction
- Haptic feedback service (light / medium / heavy / success / warning / error)
- MMKV-backed local leaderboard (top 10 scores)
- Combo scoring: streak multiplier, green-zone bonus
- Jest test suite (45 tests passing)
- GitHub Actions CI: auto-builds versioned APK on every push to `main`

### Polish & New Stations (2026-03-01)
- **2 new action stations:**
  - 🔋 ChargingStation — drag the plug onto the moving phone
  - 📶 ReceptionHunter — slide to find the sweet spot, hold for signal
- **Cartoonish characters** (`Character.tsx` redesign):
  - Emoji avatars per type: 👨/👩 (ADULT), 👦/👧 (KID), 🐕 (DOG), chosen randomly
  - Speech bubble above avatar with need text (e.g. "💧 I'm thirsty!", "🔋 Phone dying!")
  - Animated timer bar below avatar (green → yellow → red)
- **Easier difficulty tuning:**
  - WaterPitcher success window: 80–110% → **65–120%**, lock penalty: 3s → **1.5s**
  - SnackSorter swipe threshold: 50px → **30px**
  - DogDistraction required taps: 4 → **3**
  - ChargingStation hit radius: 25px → **40px**, drag threshold: -40px → **-25px**, phone speed: 1.5s → **2.5s**
  - ReceptionHunter sweet spot: 15px → **25px**, signal thresholds widened, hold: 2s → **1s**
  - Character timers: ADULT 15s → **20s**, KID 10s → **14s**, DOG 7s → **10s**
  - Spawn interval: 3s → **4s**
  - Expiry stress penalty: 10 → **7**
- All tests updated to match new thresholds; import paths fixed after `src/__tests__/` migration

---

## Up Next (ideas)

- [ ] Sound effects (siren, success chime, stress jingle)
- [ ] Game-over screen polish (final score, leaderboard entry, share button)
- [ ] Level progression / difficulty ramp over time
- [ ] More character types or needs (e.g. phone call, first aid)
- [ ] Animations: character enter/exit, station success flash
- [ ] iOS build & App Store prep
