// Game Database: Books, Stages, Monsters, Items & Lore

const GAME_DATA = {
    books: [
        {
            id: 'book_1',
            title: 'Book 1: Whispering Woods',
            subtitle: 'Basic Addition (No Carry)',
            description: 'Begin your journey through the enchanted woods by mastering single and double digit addition without carry.',
            bgImage: 'assets/backgrounds/bg_forest.jpg',
            accentColor: '#4ade80',
            stages: [
                {
                    id: 'stage_1_1',
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
                            lore: 'Slimey loves bouncy arithmetic! Keep your wits sharp and solve before he leaves a sticky trail.'
                        },
                        {
                            name: 'Berry Slime',
                            title: 'Sugar Sprite',
                            sprite: 'assets/sprites/monster_slime.jpg',
                            maxHp: 4,
                            attackPower: 1,
                            attackName: 'Sweet Squish',
                            lore: 'A sweeter, slightly tougher slime who guards the forest blueberry bushes.'
                        }
                    ],
                    rewardXp: 50,
                    rewardStars: 3
                },
                {
                    id: 'stage_1_2',
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
                            lore: 'He hates math because he only has 10 fingers and 10 toes. Show him how easy 2-digit addition is!'
                        },
                        {
                            name: 'Goblin Scout',
                            title: 'Forest Lookout',
                            sprite: 'assets/sprites/monster_goblin.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Acorn Barrage',
                            lore: 'This sneaky scout tests your column addition skills!'
                        }
                    ],
                    rewardXp: 75,
                    rewardStars: 3
                },
                {
                    id: 'stage_1_3',
                    number: '1-3',
                    name: 'Ancient Grove',
                    operationType: 'add_no_carry',
                    digits: 2,
                    waves: [
                        {
                            name: 'Mossy Goblin Captain',
                            title: 'Bandit Chief',
                            sprite: 'assets/sprites/monster_goblin.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Big Club Slam',
                            lore: 'Armored with thick tree bark and stubborn pride.'
                        },
                        {
                            name: 'Emerald Slime King',
                            title: 'Gelatinous Royal',
                            sprite: 'assets/sprites/monster_slime.jpg',
                            maxHp: 6,
                            attackPower: 1,
                            attackName: 'Royal Bounce',
                            lore: 'Wobbles menacingly while counting golden acorns.'
                        }
                    ],
                    rewardXp: 100,
                    rewardStars: 3
                },
                {
                    id: 'stage_1_4',
                    number: '1-4 (BOSS)',
                    name: 'Heart of the Forest',
                    operationType: 'add_no_carry',
                    digits: 2,
                    isBoss: true,
                    waves: [
                        {
                            name: 'Elder Treant Guardian',
                            title: 'Ancient Oak of Whispers',
                            sprite: 'assets/sprites/monster_crystal_golem.jpg',
                            maxHp: 8,
                            attackPower: 2,
                            attackName: 'Root Quake',
                            lore: 'The ancient guardian challenges you with 2-digit sums. Defeat him to unlock Book 2!'
                        }
                    ],
                    rewardXp: 150,
                    rewardStars: 5,
                    artifactUnlock: {
                        name: 'Amulet of the Forest',
                        icon: '🌿',
                        effect: '+1 Starting Heart & +10% Max Health'
                    }
                }
            ]
        },
        {
            id: 'book_2',
            title: 'Book 2: Cloud Kingdom',
            subtitle: 'Addition With Carry 🚀',
            description: 'Ascend to the floating sky ruins and conquer the Elevator Carry Bubble!',
            bgImage: 'assets/backgrounds/bg_clouds.jpg',
            accentColor: '#38bdf8',
            stages: [
                {
                    id: 'stage_2_1',
                    number: '2-1',
                    name: 'Rainbow Skyway',
                    operationType: 'add_carry',
                    digits: 1,
                    waves: [
                        {
                            name: 'Cloud Imp',
                            title: 'Breeze Trickster',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 4,
                            attackPower: 1,
                            attackName: 'Gust Whirl',
                            lore: 'When numbers sum to 10 or more, watch the 1 float up to the carry bubble!'
                        },
                        {
                            name: 'Wind Pixie',
                            title: 'Sky Dancer',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Zephyr Spark',
                            lore: 'Fast and energetic, she loves watching numbers carry over.'
                        }
                    ],
                    rewardXp: 100,
                    rewardStars: 3
                },
                {
                    id: 'stage_2_2',
                    number: '2-2',
                    name: 'Thundercloud Peak',
                    operationType: 'add_carry',
                    digits: 2,
                    waves: [
                        {
                            name: 'Storm Djinn Apprentice',
                            title: 'Lightning Caster',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Spark Zap',
                            lore: 'Harness the power of the tens column carry to break his lightning shield!'
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
                    rewardXp: 125,
                    rewardStars: 3
                },
                {
                    id: 'stage_2_3',
                    number: '2-3',
                    name: 'Sky Temple Gates',
                    operationType: 'add_carry',
                    digits: 2,
                    waves: [
                        {
                            name: 'Azure Cloud Knight',
                            title: 'Sky Vanguard',
                            sprite: 'assets/sprites/monster_djinn.jpg',
                            maxHp: 6,
                            attackPower: 2,
                            attackName: 'Thunderblade',
                            lore: 'A master of carry math who defends the Sky Citadel.'
                        }
                    ],
                    rewardXp: 150,
                    rewardStars: 3
                },
                {
                    id: 'stage_2_4',
                    number: '2-4 (BOSS)',
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
                            lore: 'The supreme ruler of Cloud Kingdom! Unleash master carrying attacks to defeat him.'
                        }
                    ],
                    rewardXp: 200,
                    rewardStars: 5,
                    artifactUnlock: {
                        name: 'Zeus Lightning Staff',
                        icon: '⚡',
                        effect: 'Power Potion duration +1 extra turn!'
                    }
                }
            ]
        },
        {
            id: 'book_3',
            title: 'Book 3: Crystal Caverns',
            subtitle: 'Basic Subtraction (No Borrow)',
            description: 'Delve deep into shimmering crystal mines to practice pure subtraction without borrowing.',
            bgImage: 'assets/backgrounds/bg_crystal_cave.jpg',
            accentColor: '#c084fc',
            stages: [
                {
                    id: 'stage_3_1',
                    number: '3-1',
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
                            lore: 'Likes taking away single items from travelers. Subtract them right back!'
                        },
                        {
                            name: 'Crystal Beetle',
                            title: 'Mine Crawler',
                            sprite: 'assets/sprites/monster_crystal_golem.jpg',
                            maxHp: 5,
                            attackPower: 1,
                            attackName: 'Mandible Crunch',
                            lore: 'A shiny beetle with a hard subtraction shell.'
                        }
                    ],
                    rewardXp: 120,
                    rewardStars: 3
                },
                {
                    id: 'stage_3_2',
                    number: '3-2',
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
                        }
                    ],
                    rewardXp: 140,
                    rewardStars: 3
                },
                {
                    id: 'stage_3_3',
                    number: '3-3',
                    name: 'Prism Hollow',
                    operationType: 'sub_no_borrow',
                    digits: 2,
                    waves: [
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
                    rewardXp: 160,
                    rewardStars: 3
                },
                {
                    id: 'stage_3_4',
                    number: '3-4 (BOSS)',
                    name: 'The Crystal Core',
                    operationType: 'sub_no_borrow',
                    digits: 2,
                    isBoss: true,
                    waves: [
                        {
                            name: 'Titan Crystal Golem',
                            title: 'Monarch of Amethyst',
                            sprite: 'assets/sprites/monster_crystal_golem.jpg',
                            maxHp: 10,
                            attackPower: 2,
                            attackName: 'Prismatic Beam',
                            lore: 'The glittering core boss! Shatter his defenses with fast and accurate subtraction.'
                        }
                    ],
                    rewardXp: 220,
                    rewardStars: 5,
                    artifactUnlock: {
                        name: 'Aegis Crystal Shield',
                        icon: '🛡️',
                        effect: 'Shield Potion now reflects 50% damage back to monster!'
                    }
                }
            ]
        },
        {
            id: 'book_4',
            title: 'Book 4: Dark Nether Citadel',
            subtitle: 'Subtraction With Borrowing 🏦',
            description: 'Face the ultimate arithmetic trial in the volcanic dungeon by mastering borrowing & regrouping!',
            bgImage: 'assets/backgrounds/bg_dark_citadel.jpg',
            accentColor: '#f43f5e',
            stages: [
                {
                    id: 'stage_4_1',
                    number: '4-1',
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
                            lore: 'Top digit smaller than bottom? Tap the tens digit to borrow 10 to the ones column!'
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
                    rewardXp: 180,
                    rewardStars: 3
                },
                {
                    id: 'stage_4_2',
                    number: '4-2',
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
                        }
                    ],
                    rewardXp: 200,
                    rewardStars: 3
                },
                {
                    id: 'stage_4_3',
                    number: '4-3',
                    name: 'Throne Room Antechamber',
                    operationType: 'sub_borrow',
                    digits: 2,
                    waves: [
                        {
                            name: 'Nether Dread Banshee',
                            title: 'Royal Phantom',
                            sprite: 'assets/sprites/monster_banshee.jpg',
                            maxHp: 8,
                            attackPower: 2,
                            attackName: 'Curse of Zero',
                            lore: 'Master of multi-step borrowing puzzles.'
                        }
                    ],
                    rewardXp: 220,
                    rewardStars: 3
                },
                {
                    id: 'stage_4_4',
                    number: '4-4 (FINAL BOSS)',
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
                            lore: 'The grand final boss of the realm! Only a true Math Knight who has conquered Borrowing can claim the Crown.'
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
