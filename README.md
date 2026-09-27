# Critters: Moonfall 🌘

[Play](https://kunruiw1991.github.io/critters-moonfall/)

An iPad-friendly isometric block-building survival game. A ten-second animated opening shows cute CatNap transforming, launching a rocket, shattering the moon, and waking the zombies. The Critters arrive to rebuild.

- Tap a character card, then an empty tile to build. Tap trees twice for wood.
- Tap a building to upgrade, repair or sell it. Drag to pan; pinch or use ± to zoom.
- Wood builds your settlement; stars buy special units and restore the moon.
- Survive six waves **and** restore all three moon pieces to win.
- ☀️ clears nearby enemies with a 30-second cooldown. ⏸ pauses and saves.
- 🧸 mode offers unlimited building resources and manually started waves.

Large graphical controls; no reading required to begin. Autosave stays in this browser. Music starts inside the game after pressing play; the speaker toggles it.

## Run locally

Serve this directory with `python3 -m http.server 8000`, then open http://localhost:8000. No build step or dependencies.

```
node --test tests/engine.test.mjs
node tests/balance.mjs
```

See [BALANCE.md](BALANCE.md) for unit roles, economy and scripted playtest results. This is a first playable prototype; the simulated strategies do not establish balance for every layout or replace playtesting with children.

## Assets

Character portraits are reused from the owner's existing Moonlight Snake Party collection. The opening animation, voxel world and effects are rendered procedurally. Existing Golden media from the owner's Lumipop Kids TV repository plays in the page; media availability depends on that repository. See [sources](assets/sources.json). Character and music rights remain with their respective owners; no third-party asset license is implied.
