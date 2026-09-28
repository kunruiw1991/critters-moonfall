# Critters: Moonfall 🌘

[Play](https://kunruiw1991.github.io/critters-moonfall/)

An iPad-friendly isometric block-building survival game. A ten-second animated opening shows cute CatNap transforming, launching a rocket, shattering the moon, and waking the zombies. The Critters arrive to rebuild.

- Tap a character card, then an empty tile to build. Tap trees twice for wood.
- Tap a building to upgrade, repair or sell it. Manual repair restores 15%, costs wood/straw/brick, and has an eight-second cooldown. Drag with one finger to pan. Twist two fingers to rotate; pinch to zoom. Two fingers can rotate, zoom and move the map together. ↶ / ↷ rotate by 45°; ⌖ restores the original view.
- 🪵 Wood, 🌾 straw, 🧱 brick and ✦ stars have different uses. PickyPiggy grows straw; BabaChops runs a brick kiln using wood and straw. Walls and advanced towers need brick; rapid/spring towers use straw. Building upgrades and repairs also cost materials.
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
- 💚 Healer: heals nearby zombie allies, not itself; overlapping healing does not stack. Splash damage helps break the group.
- 🔮 Summoner: creates at most two weaker minions; the wave ends only when all minions are cleared.
- 🌘 Nightmare CatNap: the armored final boss.

## Six-map campaign

| Level | Map | New challenge | In-game soundtrack from existing collection |
|---|---|---|---|
| 1 🌲 | Moonlit forest | Learn the economy and defend the base | Golden |
| 2 🌉 | River bridges | Crossings funnel enemies; more spitters | Soda Pop |
| 3 ❄️ | Icefield | Ice accelerates enemies; more runners | What It Sounds Like |
| 4 🏜️ | Canyon | Rock barriers constrain buildings; more bombers | Takedown |
| 5 🌋 | Lava rifts | Lava removes building space; more summoners | Your Idol |
| 6 🏰 | Night castle | Stone obstacles, healers and two final bosses | Golden / Takedown mix |

Victory unlocks the next map. After six, maps repeat with increasing enemy difficulty. Creative mode lets you select all six maps immediately using ◀ / ▶. Each map has a thumbnail, its own terrain palette and in-game music. Music uses existing repository video/audio tracks; no external player opens. Tracks repeat within their map.

Run `node tests/campaign.mjs` for an example scripted route through all six stages.

## Readable enemies and support economy

Enemies have colored bodies and distinct sizes rather than floating type icons: green ordinary zombies, small red runners, giant blue armored brutes, yellow-green spitters, round orange bombers, turquoise healers, tall purple summoners and tiny gold minions. Runners appear in wave one; armored and explosive enemies begin in wave two.

PickyPiggy visibly grows wheat and produces 0.8 straw plus 0.2 stars per second. BabaChops turns one wood and 0.7 straw into each brick, at 0.45 brick/second before upgrades. Bobby repairs one nearby damaged building at 1 HP/second, consumes 0.3 straw/HP, waits three seconds after that building was hit, and never heals the base. Multiple bears cannot stack repair on the same target.

Spitters attack from 5.5 cells away, prioritize straw/brick producers and splash onto tightly packed neighbors. Bombers deal 120 base damage to walls and 70 to nearby other buildings. CraftyCorn's expensive prism has 6.2 range to counter siege. Natural rocks block direct tower shots; prism shots arc over them.
