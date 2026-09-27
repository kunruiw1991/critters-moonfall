# Balance: production, protection, firepower

The central choice is spending now to survive versus investing for the next wave. A mill repays its 55 wood in 50 seconds; a garden recovers its 15-star component in about 33 seconds but also costs 35 wood. Base passive income prevents complete economic deadlock. Trees reward active collecting.

| Builder | Unit | Wood / stars | Purpose |
|---|---|---|---|
| DogDay | Sun turret | 45 / 15 | Reliable basic damage, weak against armor |
| KickinChicken | Rapid turret | 60 / 10 | Frequent shots for fast small enemies |
| CraftyCorn | Prism | 70 / 35 | Armor piercing, splash and slowing |
| Mikey | Wall | 18 / 0 | Absorbs damage and changes routes |
| Hoppy | Spring | 35 / 10 | Short-range area damage |
| Bobby | Healing garden | 50 / 20 | Repairs nearby buildings; weaker core healing |
| Bubba | Mill | 55 / 0 | 1.1 wood per second |
| PickyPiggy | Star garden | 35 / 15 | 0.45 stars per second |
| JJ | Beacon | 50 / 25 | Nearby damage ×1.25, does not stack |
| Luna | Shelter | 60 / 30 | Nearby incoming damage ×0.65, does not stack |

Upgrades stop at level three. Each level adds 50% of base attack, healing, production and maximum health. Support aura strength does not scale; upgrades improve their durability. Building placement matters: enemies choose routes weighted by distance and the effort of breaking obstacles. Walls can be destroyed, so sealing all paths cannot freeze the wave.

The first two waves arrive from the left; later waves use all four edges. Runners punish holes, armored brutes reward prisms, and the final Nightmare CatNap demands sustained damage. The 30-second sunburst gives the player an active rescue tool. Repairing the moon costs 40, 60 and 80 stars, competing with special towers; each repair heals the core.

## Reproducible simulation

`node tests/balance.mjs` runs three simple build policies across seeds 17, 731 and 922. Every policy uses the same sunburst trigger and moon purchase reserve. Mixed policy also buys attacker upgrades once its build list completes; these are illustrative policies, not an equal-budget scientific comparison.

| Scripted policy | Results over 3 seeds | What it checks |
|---|---|---|
| Mixed production + turrets + support | 3 wins, about 420–423 seconds | Complete survival and moon-restoration loop is achievable |
| Production only after starter turret | 3 losses, wave 3, about 189–207 seconds | Economy has a defensive opportunity cost |
| Basic sun turrets only | 3 losses, wave 6, about 414–429 seconds | This particular single-unit layout cannot defeat the armored boss |

Mixed policy finished with full core health, suggesting considerable room for mistakes once support is established. These results are preliminary, not proof that every unit is equally useful. More player layouts and child playtests are needed before stronger balance claims. Creative mode removes resource pressure and core loss and lets the player choose when to spawn waves.
