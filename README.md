# Critters: Moonfall 🌘

[Play](https://kunruiw1991.github.io/critters-moonfall/)

An iPad-friendly isometric block-building survival game. A ten-second animated opening shows cute CatNap transforming, launching a rocket, shattering the moon, and waking the zombies. The Critters arrive to rebuild.

- Tap a character card, then an empty tile to build. Tap trees twice for wood.
- Tap a building to upgrade, repair or sell it. Drag with one finger to pan. Twist two fingers to rotate; pinch to zoom. Two fingers can rotate, zoom and move the map together. ↶ / ↷ rotate by 45°; ⌖ restores the original view.
- Wood builds your settlement; stars buy special units and restore the moon.
- Clear all six waves to win automatically. The moon repairs itself in the ending; buying moon pieces during play is optional healing. Celebrate with fireworks, confetti, dancing Critters and a victory fanfare.
- 🔥 ➜ starts the next harder level immediately. Cleared levels unlock permanently in this browser; use the 🌙 / 🔥 level selector on the home screen to replay them. ↻ retries the current level; 🏠 returns home.
- ☀️ clears nearby enemies with a 30-second cooldown. ⏸ pauses and saves.
- 🧸 mode offers unlimited building resources and manually started waves. Tap 🏁 to finish your creative session with a celebration.

Large graphical controls; no reading required to begin. Autosave stays in this browser. Music starts inside the game after pressing play; the speaker toggles it.

## Run locally

Serve this directory with `python3 -m http.server 8000`, then open http://localhost:8000. No build step or dependencies.

```
node --test tests/*.test.mjs
node tests/balance.mjs
```

See [BALANCE.md](BALANCE.md) for unit roles, economy and scripted playtest results. This is a first playable prototype; the simulated strategies do not establish balance for every layout or replace playtesting with children.

## Assets

Character portraits are reused from the owner's existing Moonlight Snake Party collection. The opening animation, voxel world and effects are rendered procedurally. Existing Golden media from the owner's Lumipop Kids TV repository plays in the page; media availability depends on that repository. See [sources](assets/sources.json). Character and music rights remain with their respective owners; no third-party asset license is implied.

## Zombie roles

- 💨 Runner: fast, fragile; rapid towers cover gaps.
- 🛡️ Brute: armored; prisms pierce armor.
- 🫧 Spitter: fires from three cells away; extend turret coverage beyond walls.
- 💣 Bomber: stops and flashes a warning ring for 1.5 seconds, then blasts nearby buildings, especially walls; kill or slow it early and space buildings apart.
- 💚 Healer: heals nearby allies, not itself; overlapping healing does not stack. Splash damage helps break the group.
- 🔮 Summoner: creates at most two weaker minions; the wave ends only when all minions are cleared.
- 🌘 Nightmare CatNap: the armored final boss.
