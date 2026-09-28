# Material economy and siege rebalance

This version replaces the previous wood-heavy economy. Earlier simulation results describe the old rules and are superseded below.

## Materials

Start with 170 wood, 50 straw, 35 brick and 50 stars at level one. Higher stages grant modest starting bonuses. Pig farms need only wood to bootstrap straw production; kilns need wood and straw. Material fields are added to older saves without resetting their map, buildings or unlocked levels.

| Building | Wood | Straw | Brick | Stars |
|---|---:|---:|---:|---:|
| DogDay sun |45|10|0|15|
| Rapid tower |60|18|0|10|
| Prism |70|0|22|35|
| Wall |10|0|12|0|
| Spring |35|16|0|10|
| Bear |50|20|8|20|
| Mill |55|0|0|0|
| Pig farm |35|0|0|0|
| Brick kiln |45|15|0|0|
| Boost |50|12|12|25|
| Shield |60|0|25|30|

A pig produces 0.8 straw and 0.2 stars/second. A kiln produces 0.45 bricks/second while consuming one wood and 0.7 straw per brick. It stops when inputs run out. Upgrades require materials as well as stars; selling returns half the base recipe. Clearing a wave grants eight straw and five brick.

## Healing limits

Bear base healing falls from 6 to 1 HP/second. Each bear treats one structure at a time, cannot treat itself, cannot heal the core, cannot stack on one target with other bears, and waits until that target has not been hit for three seconds. Healing consumes 0.3 straw per restored HP. Higher levels add 25% healing each, not 50%.

Manual repair costs 10 wood, four straw and three brick, restores 15% maximum HP and has an eight-second cooldown. The same three-second combat lock applies. Upgrades preserve existing missing health rather than granting a free full repair. Wave-end core healing falls from 35 to 15.

## Why a tightly packed castle is vulnerable

Spitters shoot from 5.5 cells, prefer farms and kilns, and splash nearby buildings. Bombers stop for a 1.5-second warning, then damage every nearby structure (120 base damage to walls, 70 to others). Walls have 220 HP instead of 320. A ranged 6.2-cell prism is the expensive siege counter. Rocks block direct fire, while prism shots arc over them; canyon placement therefore matters for attack as well as movement.

## Validation

Run `node --test tests/*.test.mjs`, `node tests/campaign.mjs` and `node tests/balance.mjs`. The last script intentionally retains old wood-heavy policies as a regression comparison.

The old campaign plan, without brick production, lost all six stages on seed 731. The new material-aware plan builds pig farms, kilns and separated prism positions. Results below are scripted examples, not exhaustive human playtests or a guarantee that castle building can never succeed. Higher difficulties still need feedback from real play.

Six maps retain their distinct routes, ice speed effects, mixed enemy waves, per-map music and automatic victory celebration. No floating enemy-type icons are used; colors, whole-body scale and silhouettes identify enemy roles.

On seed 731 the revised production-and-outpost policy won stages 1–6 in 428, 455, 471, 491, 509 and 525 seconds. Stage five needed an extra forward prism; surviving structures ranged from 11 to 17 after losses. The first-stage policy still has generous room once its economy is established. This is one seed, not a comprehensive difficulty calibration.

## River map learning curve (v7)
Stage 2 now starts with a pig and brick kiln, plus 60 wood, 30 straw, 25 bricks and 25 stars above its previous allocation. Preparation is 55 seconds; breaks are 45 seconds. Enemy count is 75% rounded up, HP 80%, damage 70%, and spawn spacing 2.4 seconds. Wave clears restore 65 core HP. Waves 1–2 contain only walkers/runners, wave 3 introduces a brute, wave 4 a spitter, with the broader mix returning in wave 5 and the boss in wave 6. Other stages and the material/repair rules are unchanged.

Five deterministic seeds pass a basic eight-building plan with one build attempt every 15 seconds and no upgrades, manual repair, harvesting, moon restoration or sunburst. This checks a more forgiving route, not every player layout. Restart stage 2 for the new starting buildings and supplies; unlocked stages remain saved.

## Map caps (v8)
Live caps include starting units, apply in both modes and reset per map. Selling or losing a unit releases its slot; upgrades keep the slot. Existing saves retain their buildings, but cannot add more of a type already at its limit.

| Unit | Maximum |
|---|---:|
| DogDay | 6 |
| KickinChicken | 4 |
| CraftyCorn | 6 |
| Mikey walls | 8 |
| Hoppy | 4 |
| Bobby BearHug | 2 |
| Bubba / PickyPiggy / BabaChops | 3 each |
| JJ / Luna Bat | 2 each |

Producer caps support the new material economy; lower support caps discourage repair/shield clusters. Eight walls allow small defenses, not a map-spanning castle. The second-map novice scenarios and six-map campaign remain passable in the automated simulations.

## Six-piece story
Nightmare CatNap shatters the moon into six visible pieces. The team arrives to defend them. Each of the first six survival maps awards its own piece once; replays, defeat and creative mode award none. Progress is stored locally; previously unlocked maps migrate to collected pieces. The sixth piece completes the moon above a critter campfire; the next-level button still offers bonus harder maps. The star ability protects/heals the fragment base; it no longer depicts premature moon completion.
