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

## Material specialization, footprints and fire (v13)
Per-map live cap 20, including starters. Per-type caps: sun 4, rapid 3, prism 2, wall 6, spring 3, bear 2, each producer 2, booster/shield 1. Old excess buildings survive, but block new construction until below limits.

Recipes (wood/straw/brick/star): sun 25/15/0/15; rapid 15/35/20/10; prism 10/25/70/35; wall 10/0/16/0; spring 15/30/15/10; bear 15/35/20/20; mill 35/10/0/0; pig 25/0/0/0; kiln 20/25/10/0; boost 10/30/35/25; shield 10/20/55/30. Advanced upgrade bricks scale at full base recipe per tier, wood only 40%. Kilns use .35 wood and .7 straw per brick. Mills make .85 wood/s; ordinary kills give 1 wood and wave clears 15, reducing runaway wood rewards. Prism damage is 28 and HP 180 to justify its larger investment.

New rapid occupies 2×1, prism 2×2, shield an L of three cells. Every tile checks terrain, bounds, core, trees, existing footprints and enemies before any payment. Picking any cell selects the building. Pathfinding considers all cells and melee can attack the far edge; destruction/selling releases the whole footprint. UI previews all cells, displays a footprint pictogram and the overall building count. Older saves retain original one-cell foundations without overlap; new constructions use the new shapes.

Map 5 now has a crossable lava ring rather than impassable islands. Building on lava is forbidden. First contact permanently multiplies enemy current/max HP by 1.3, damage by 1.25 and speed by 1.15, once only. Fire ground aura and licking flames preserve each enemy's distinct silhouette. Saved fire status prevents reapplication.

59 tests pass. Updated map-2 slow-build policy (including added material production) wins five seeds without upgrades/abilities. The six-map campaign now tests levels 1–4 with no palace purchases and levels 5–6 with attack/armor/production tier 2 plus supplies tier 1 (34 moons, affordable from the tested first four clears). All win on seed 731; remaining core HP 700/700/369/254/777/160. Level 3 ends with wood425/straw15/brick7: advanced resources are now genuinely spent. These are limited simulations, not a claim every layout will win.


## v14: construction pacing and full-size architecture
- Starting wood 125 / stars 35. Mill 0.55 wood/s; no passive wood or stars, no kill wood; trees give 12 wood total, wave clear gives 8 wood and no stars. Gardens produce straw only.
- Stars by threat: normal 1, runner 2, brute 7, spitter 3, bomber 4, healer 4, summoner 6, summoned mini 0, boss 18. Fire adds one except minis. Rapid costs 24 stars, prism 55.
- Existing six-wave structure, 20s preparation, 12s breaks and 1.65s spawn cadence retained. Map 4+ first wave introduces ranged spitter before explosive bomber on wave 2. Opening basic defenses earn stars for specialized anti-armor and support builds.
- Full world-space prism citadel (2x2), twin ballista (2x1), and linked shield bastion (L). Geometry rotates with camera. Old single-cell buildings retain compatible models. Cards separate portrait, 2x2 resource grid, count, and actual footprint diagram.
- Seed 731 reference strategy: maps 1–4 no palace purchases, maps 5–6 use the previously documented 34-moon upgrades. All win, 14–16 buildings alive; end wood 52–101, stars 20–45. This is a reference policy, not proof all strategies work. River regression across five seeds passes with a resource-first build order, no powers or upgrades.


## v16: tiered loot and upgrade progression
- Stars are separate stored currencies: ✦ basic, 🔷 blue, 🌟 gold. Normal/runner drop basic; brute (2 basic/2 blue), spitter (1/1), bomber (2/1), healer (1/2), summoner (2/1/1 gold), boss (6/4/3 gold). Minis drop nothing. Fire adds one basic. No passive star generation.
- Prism costs 25 basic plus 2 blue; shield 2 blue, boost 1 blue. Other basic builds remain available before elites appear. Upgrade Lv2 costs 1 blue for combat/support (none for production/walls); Lv3 2 blue/1 gold; Lv4 3 blue/2 gold. Wood upgrades cost 30/40/50 and consume straw/brick as well. Max level 4; each level adds 50% base damage/production and 65% base HP.
- Capacity by wave 0–6: 10,12,14,17,20,23,26. Existing over-cap saves are retained; upgrades ignore construction cap. Per-type limits remain.
- Mill 0.45 wood/s (was 0.55), harvest 8/tree (was 12), clear reward 4 wood (was 8). Bear repairs 4 HP/s out of combat, 1.6 in combat; +35% healing per upgrade. Each HP costs .18 straw/.04 wood, no stacking on one target, no base repair, range 3.4.
- Save migration starts new rare currencies at zero and preserves existing resources. Build/Upgrade dock exposes one card per existing structure; full recipe, next-level health and role gain, unavailable/max state. Main menu has bilingual new/load, modes, palace; load previews level/wave.
- Seed 731 reference with upgrades during waves: six wins; maps 1–4 no palace boosts, maps 5–6 with prior documented 34-moon purchases. Remaining wood 5–37, basic stars 7–30. Five river seeds pass slow build+upgrade policy without powers or repair micro. Spawn spacing and breaks unchanged.


## v17: three producers each, fixed upgrade tool, harvest stress
- Nine starting production units: three mills, three gardens, three kilns around the fragment, plus DogDay. Production caps now three each. Capacity by prep/waves: 14/16/18/21/24/27/30, including producers.
- Per building per second: wood .23, straw .42, bricks .20. Kiln consumes .35 wood + .7 straw per brick, preserving 15 wood / 30 straw before conversion. Three of each net roughly .48 wood / .84 straw / .60 brick per second before repairs or spending. Producer upgrades +15% per level, instead of +50%, to prevent runaway output. Bear straw cost .08 per HP; healing speed unchanged.
- Normal stars: ordinary 3, runner 4, brute 8, spitter 5, bomber 6, healer 5, summoner 8, boss 20. Diamonds: brute 2, spitter/bomber/healer 1, summoner 2, boss 4. Gold stars: brute/summoner 1, boss 3. Summoned minis remain zero. Prism consumes one gold star.
- Every upgrade, every building/level: wood25 straw15 brick15 basic-star20 diamond2 gold-star1. One persistent button selects upgrade mode, then tapping a building upgrades it; valid buildings receive ground rings. Maximum level remains four. No separate per-building upgrade cards or duplicate upgrade action.
- UI: wood / straw / brick / ordinary star / diamond / golden star. Bottom: attack (including buff), defense, healing, production, fixed upgrade tool. Existing blueStar save key retained internally for diamond compatibility. Existing saves preserved; nine-producer layout applies to new games.
- Stress results in tests/stress-results.json: 30 seeded runs, five per map; 29 wins, one loss on map6. Maps5–6 use 34 moons of palace upgrades; map2 decision interval is15s, others2s. Strategy builds anti-armor prism before healer, replaces destroyed production below two per type, and uses normal powers. These are reference-policy outcomes, not all-player win guarantees. Base/max harvest-output tests run 120 simulated seconds, with all three resource increments between50 and200 and no passive star gain.


## v18: easy default, Heat 0–10, no construction caps
- New games default to Heat0. Heat multiplier is linear: 1 + .2 * heat; Heat5=2x and Heat10=3x. Applies to all construction recipe materials and new enemy HP/damage. Heat persists with the save and into subsequent maps. Upgrade remains a fixed recipe independent of target, level, count, or Heat.
- Nine initial producers remain. Per producer: wood .65/s, straw1.05/s, brick .5/s. Net three-each output before repairs: wood1.425/s, straw2.10/s, bricks1.5/s. Base enemies use .6 HP and .52 damage coefficients (previous .85/.8 lineage) for easier default play. Starting ordinary stars60. Ordinary drops4, runner6, brute/summoner10, spitter/bomber/healer8, boss30. Diamond/gold drops unchanged.
- No per-type or map count limit. Next construction cost = ceil(base recipe * (1+.5 * alive same-type count) * Heat multiplier). Count includes starter producers. Dead units immediately stop affecting prices. Card price, readiness, validation and actual payment share buildCost(). Stored paidCost controls sale refunds; free starters return no materials, preventing price-inflation arbitrage.
- Resource storage raised from999 to1e9 so the former wallet cap does not impose a practical building-count cap. Saved old resources and buildings are preserved; missing Heat defaults0.
- Main-menu touch Heat slider shows exact multipliers; HUD/save preview display Heat. Build cards show current live count and current recipe, no cap denominator.
- 66 reference-policy stress runs: Heat0 30/30 wins across six maps/five seeds, with no palace boosts; map2 uses slow15s decisions. Heat5 and10 each0/18 wins with the same unchanged easy-policy build order. These high-Heat results demonstrate increased challenge, not proof of impossibility or a validated winning strategy. Numeric tests verify every Heat step and no mutation of fixed upgrade cost.

## v19 — cheaper sheep construction and more ordinary stars

BabaChops base brick construction requirement drops from 10 to 5; production remains 0.5 brick/second. Existing Heat and duplicate-building price multipliers still apply. All ordinary enemy star drops, including the lava bonus, are doubled. Diamond and golden-star drops are unchanged; summoned mini zombies still drop no resources.

## v20 — half-price construction and upgrades

All six construction material requirements are multiplied by 0.5 before Heat and live duplicate multipliers, then rounded up to whole resources. The fixed upgrade recipe is halved and rounded up: 13 wood, 8 straw, 8 brick, 10 ordinary stars, 1 diamond, 1 golden star. Production, enemy drops, and existing resources are unchanged. Existing saves receive the new prices automatically.

## v21 — reset campaign progression on New Game

New Game clears fragment ownership, palace wallet, purchased upgrades, and per-level reward bests. Survival starts at level 1 with 0/6 fragments and resets campaign unlocks. Retry, next level, and Load Game preserve progression. Clear the old active save immediately, including during the intro. The palace now labels upgrades as lasting for the current campaign.
