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

## Unified pacing and Guanghan Palace (v9, supersedes v7 river exceptions)
Every map starts with 170 wood, 50 straw, 35 bricks, 50 stars and the same sun/mill/pig/kiln. Preparation is 20 seconds, breaks 12 seconds, spawn spacing 1.65 seconds and clear healing 35. Each stage adds one enemy per wave (up to +12), +8% base enemy HP and +6% base damage; global HP/damage factors are .85/.8. Every map introduces walkers/runners first, then a brute in wave 3, a spitter in wave 4 and the broader mix in wave 5. Maps retain their terrain. Bonus sixth-map boss remains.

Settlement score: surviving building health and upgrade level (maximum 300), leftover wood/straw plus double-weight bricks/stars divided by 5 (maximum 200), base health fraction (maximum 200), and victory (200). A survival win earns 2 + floor(score/150) small moons. Each map stores its best paid reward: replay pays only an improvement, preventing duplicate settlement or unlimited idle farming. Defeat and creative grant no currency. Small moons are separate from the six unique story fragments.

Palace permanent upgrades each have 3 tiers, priced 4/6/8 small moons: attack +8% per tier; base/building health +12%; production +10%; starting pack +30 wood/+15 straw/+10 bricks/+10 stars. New games snapshot upgrades; purchases do not modify an already running saved map. Wallet, purchases and paid records persist together locally. The next-level button opens the palace with an optional purchase and immediate next-map button. Selected cards rise 6px; availability still uses only light/dark backgrounds.

Validation: 47 tests including progression, rewards, duplicate settlement, purchasing, actual combat/production effects and finale. All six scripted campaigns pass with no purchased upgrades; first two stages complete around 328/335 seconds on seed 731. Five slow-building stage-two seeds also pass. These samples do not guarantee every player layout.

## Visual and map redesign (v11)
The palace is now a code-native pastel toy-like SVG hall matching the chunky game geometry, with a separate animated jade rabbit hopping over its roof. No photorealistic backdrop is referenced. Reduced motion freezes the rabbit and hall.

Map 3: cross-shaped ice highways run from all four spawn entrances to the base perimeter. Ice accelerates enemies 1.7× and forbids construction; the central starter area remains solid. Map 4: removed all defensive rock rows, added four marked internal burrow entrances. First two waves use two gates; later waves use all four. Sand accelerates enemies 1.12×. No timer extension: preparation 20 seconds and break 12 seconds still apply everywhere. The break starts after a wave is cleared; removing the old detours reduces the waiting tail. Weighted pathfinding now uses a priority heap instead of repeatedly scanning every map cell. The frame accumulator allows 0.5 seconds of catch-up rather than losing elapsed time above 0.12 seconds.

Level 3+ now exposes a brute and spitter/bomber in wave 1, healer in wave 2, summoner in wave 3. Distinct meshes: humanoid walker, four-legged red runner, armored broad blue brute, squat snouted green spitter, spherical orange fuse bomber, winged mint ghost healer, tall purple pointed-hat summoner and small gold crawler. No floating type icons.

Old saved maps 3/4 migrate to new terrain without deleting buildings. Existing occupied restricted tiles become foundations; path caches reset.

Score no longer saturates buildings at 300 or resources at 200. Building score uses surviving health × level weight, materials retain weighted value, pace rewards faster clears, and challenge adds 25 per stage. Coin reward is 2 + floor(total/90), with no fixed eight-coin ceiling. Existing per-stage best-paid records continue preventing duplicate payouts; an improved replay pays its difference. Sample fresh-run rewards on seed 731 are 12,13,12,13,14,13. This is a measured sample, not fixed rewards.

52 tests pass. The six-map campaign passes without palace purchases. tests/visuals.html is a read-only developer model/map gallery using production render functions, isolated from player saves.

### Render dispatch correction (v12)
Visual QA of the actual map exposed a pre-existing bug: wrapping enemies as render objects overwrote their `kind` with `enemy`, losing subtype information. The map now carries `enemyType` separately and uses it for mesh, palette, scale and CatNap boss dispatch. A regression test exercises the complete production renderer with all specialist types, not just the individual mesh function. 53 tests pass.
