// Game Database: Worlds (Addition & Subtraction), Stages, Monsters & Items

const GAME_DATA = {
    books: [
        {
            id: 'world_addition',
            worldKey: 'addition',
            title: 'Realm of Addition',
            subtitle: 'Mastery of Sums & Carrying ➕',
            description: 'Journey across enchanted forests and floating cloud peaks. Master basic addition in Stages 1-2, then conquer carry regrouping in Stages 3-5!',
            bgImage: 'assets/backgrounds/bg_forest.jpg',
            bgSkyImage: 'assets/backgrounds/bg_clouds.jpg',
            accentColor: '#4ade80',
            icon: '➕',
            stages: [
                {
                    id: 'stage_add_1',
                    number: '1-1',
                    name: 'The Bubbly Clearing',
                    operationType: 'add_no_carry',
                    digits: 1,
                    waves: [
                        {
                            name: 'Slimey the Goo',
                            title: 'Forest Jelloid',
                            sprite: 'assets/sprites/monster_slime.jpg',
                            maxHp: 3,
                            attackPower: 1,
                            attackName: 'Slime Splash',
                            lore: 'Slimey loves single-digit addition! Solve before he leaves a sticky trail.'
                        },
                        {
                            name: 'Berry Slime',
                            title: 'Sugar Sprite',
                            sprite: 'assets/sprites/monster_slime.jpg',
                            maxHp: 4,
                            attackPower: 1,
                            attackName: 'Sweet Squish',
                            lore: 'A sweet slime guarding forest blueberry bushes.'
                        }
                    ],
                    rewardXp: 50,
                    rewardStars: 3
                },
                {
                    id: 'stage_add_2',
                    number: '1-2',
                    name: 'Goblin Outpost',
                    operationType: 'add_no_carry',
                    digits: 2,
                    waves: [
                        {
                            name: 'Grumpy Goblin',
                            title: 'Club Swinger',
                            sprite: 'assets/sprites/monster_goblin.jpg',
                            maxHp: 4,
                            attackPower: 1,
                            attackName: 'Wooden Bonk',
                            lore: 'He hates math because he only has 10 fingers. Show him how easy 2-digit sums are!'
                        },
                        {
                            name: 'Goblin Scout',
                            title: 'Forest Lookout',
                            sprite: 'assets/sprites/monster_goblin.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Acorn Barrage',
                            lore: 'Tests your column addition skills!'
                        }
                    ],
                    rewardXp: 75,
                    rewardStars: 3
                },
                {
                    id: 'stage_add_3',
                    number: '1-3',
                    name: 'Rainbow Skyway',
                    operationType: 'add_carry',
                    digits: 2,
                    waves: [
                        {
                            name: 'Cloud Imp',
                            title: 'Breeze Trickster',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 4,
                            attackPower: 1,
                            attackName: 'Gust Whirl',
                            lore: 'When columns sum to 10 or more, click the Carry Bubble (+1) above the tens column!'
                        },
                        {
                            name: 'Wind Pixie',
                            title: 'Sky Dancer',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Zephyr Spark',
                            lore: 'Fast and energetic sky dancer testing your carrying accuracy.'
                        }
                    ],
                    rewardXp: 100,
                    rewardStars: 3
                },
                {
                    id: 'stage_add_4',
                    number: '1-4',
                    name: 'Thundercloud Peak',
                    operationType: 'add_carry',
                    digits: 2,
                    waves: [
                        {
                            name: 'Storm Djinn Apprentice',
                            title: 'Lightning Caster',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 6,
                            attackPower: 2,
                            attackName: 'Spark Zap',
                            lore: 'Harness the power of carry addition to break his lightning shield!'
                        },
                        {
                            name: 'Volt Sprite',
                            title: 'Electric Elemental',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 6,
                            attackPower: 2,
                            attackName: 'Static Shock',
                            lore: 'Zaps in with high carry additions!'
                        }
                    ],
                    rewardXp: 140,
                    rewardStars: 3
                },
                {
                    id: 'stage_add_5',
                    number: '1-5 (BOSS)',
                    name: 'Grand Sky Palace',
                    operationType: 'add_carry',
                    digits: 2,
                    isBoss: true,
                    waves: [
                        {
                            name: 'Lord Thunder Djinn',
                            title: 'Emperor of the Skies',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 10,
                            attackPower: 2,
                            attackName: 'Mega Lightning Storm',
                            lore: 'The supreme ruler of Cloud Kingdom! Unleash master carrying attacks to conquer the Addition Realm.'
                        }
                    ],
                    rewardXp: 250,
                    rewardStars: 5,
                    artifactUnlock: {
                        name: 'Zeus Lightning Staff',
                        icon: '⚡',
                        effect: 'Power Potion deals extra critical strike damage!'
                    }
                }
            ]
        },
        {
            id: 'world_subtraction',
            worldKey: 'subtraction',
            title: 'Realm of Subtraction',
            subtitle: 'Mastery of Differences & Borrowing ➖',
            description: 'Delve into amethyst crystal mines and volcanic dungeons. Master basic subtraction in Stages 1-2, then master column borrowing in Stages 3-5!',
            bgImage: 'assets/backgrounds/bg_dark_citadel.jpg',
            bgCaveImage: 'assets/backgrounds/bg_crystal_cave.jpg',
            accentColor: '#f43f5e',
            icon: '➖',
            stages: [
                {
                    id: 'stage_sub_1',
                    number: '2-1',
                    name: 'Amethyst Entrance',
                    operationType: 'sub_no_borrow',
                    digits: 1,
                    waves: [
                        {
                            name: 'Gem Pebble Imp',
                            title: 'Cave Scavenger',
                            sprite: 'assets/sprites/monster_crystal_golem.jpg',
                            maxHp: 4,
                            attackPower: 1,
                            attackName: 'Gem Toss',
                            lore: 'Likes taking away items from travelers. Subtract them right back!'
                        },
                        {
                            name: 'Crystal Beetle',
                            title: 'Mine Crawler',
                            sprite: 'assets/sprites/monster_crystal_golem.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Mandible Crunch',
                            lore: 'A shiny beetle with a hard basic subtraction shell.'
                        }
                    ],
                    rewardXp: 100,
                    rewardStars: 3
                },
                {
                    id: 'stage_sub_2',
                    number: '2-2',
                    name: 'Shimmering Hall',
                    operationType: 'sub_no_borrow',
                    digits: 2,
                    waves: [
                        {
                            name: 'Geode Sentry',
                            title: 'Stone Guardian',
                            sprite: 'assets/sprites/monster_crystal_golem.jpg',
                            maxHp: 6,
                            attackPower: 1,
                            attackName: 'Crystal Spike',
                            lore: 'Solve 2-digit subtractions column by column from right to left.'
                        },
                        {
                            name: 'Amethyst Rock Golem',
                            title: 'Deep Core Brute',
                            sprite: 'assets/sprites/monster_crystal_golem.jpg',
                            maxHp: 7,
                            attackPower: 2,
                            attackName: 'Earthquake Stomp',
                            lore: 'Tough as bedrock, but accurate subtractions crack his defense.'
                        }
                    ],
                    rewardXp: 130,
                    rewardStars: 3
                },
                {
                    id: 'stage_sub_3',
                    number: '2-3',
                    name: 'Gates of Doom',
                    operationType: 'sub_borrow',
                    digits: 2,
                    waves: [
                        {
                            name: 'Shadow Wisp',
                            title: 'Nether Ghost',
                            sprite: 'assets/sprites/monster_banshee.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Soul Chill',
                            lore: 'Top digit smaller than bottom? Tap the tens digit to borrow 1, adding 1 before the ones digit!'
                        },
                        {
                            name: 'Spectral Banshee',
                            title: 'Wailing Spirit',
                            sprite: 'assets/sprites/monster_banshee.jpg',
                            maxHp: 6,
                            attackPower: 2,
                            attackName: 'Wailing Screech',
                            lore: 'Her chilling screeches disorient heroes who forget to reduce the tens digit by 1.'
                        }
                    ],
                    rewardXp: 160,
                    rewardStars: 3
                },
                {
                    id: 'stage_sub_4',
                    number: '2-4',
                    name: 'Lava Bridge',
                    operationType: 'sub_borrow',
                    digits: 2,
                    waves: [
                        {
                            name: 'Magma Banshee Priestess',
                            title: 'Flamespeaker',
                            sprite: 'assets/sprites/monster_banshee.jpg',
                            maxHp: 7,
                            attackPower: 2,
                            attackName: 'Hellfire Blast',
                            lore: 'Can you solve tricky regrouping before the lava rises?'
                        },
                        {
                            name: 'Nether Dread Banshee',
                            title: 'Royal Phantom',
                            sprite: 'assets/sprites/monster_banshee.jpg',
                            maxHp: 8,
                            attackPower: 2,
                            attackName: 'Curse of Zero',
                            lore: 'Master of multi-step borrowing subtraction.'
                        }
                    ],
                    rewardXp: 200,
                    rewardStars: 3
                },
                {
                    id: 'stage_sub_5',
                    number: '2-5 (FINAL BOSS)',
                    name: 'The Infernal Throne',
                    operationType: 'sub_borrow',
                    digits: 2,
                    isBoss: true,
                    waves: [
                        {
                            name: 'Ignis the Nether Dragon',
                            title: 'Supreme Lord of Math Citadel',
                            sprite: 'assets/sprites/monster_dragon.jpg',
                            maxHp: 12,
                            attackPower: 3,
                            attackName: 'Dragon Inferno Breath',
                            lore: 'The grand final boss! Only a true Math Knight who has conquered Borrowing can claim the Crown.'
                        }
                    ],
                    rewardXp: 350,
                    rewardStars: 10,
                    artifactUnlock: {
                        name: 'Crown of Arithmetic Champion',
                        icon: '👑',
                        effect: 'Permanent +2 Max Hearts and Gold Knight Cape!'
                    }
                }
            ]
        }
    ],

    potions: {
        heal: {
            id: 'heal',
            name: 'Health Elixir',
            icon: '❤️',
            desc: 'Restores 2 lost Hearts',
            sound: 'playPotionHeal'
        },
        power: {
            id: 'power',
            name: 'Power Tonic',
            icon: '⚡',
            desc: 'Next attack deals 2x Damage!',
            sound: 'playPotionPower'
        },
        shield: {
            id: 'shield',
            name: 'Aegis Shield',
            icon: '🛡️',
            desc: 'Blocks the next enemy attack if wrong',
            sound: 'playShieldBlock'
        }
    }
};

window.GAME_DATA = GAME_DATA;
