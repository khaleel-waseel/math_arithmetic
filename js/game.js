// Main Game State & Combat Engine for Math Knight Adventures

class GameApp {
    constructor() {
        this.saveKey = 'math_knight_adventures_save_v2';
        this.state = this.loadState();

        // Runtime Battle State
        this.currentBook = null;
        this.currentStage = null;
        this.currentWaveIndex = 0;
        this.currentMonster = null;
        this.monsterHp = 0;
        this.heroHp = 5;
        this.heroMaxHp = 5;
        this.streak = 0;
        this.powerPotionActive = false;
        this.shieldPotionActive = false;
        this.currentProblem = null;
        this.isProcessingTurn = false;

        // Carry / Borrow UI state for current question
        this.carryStates = {};
        this.borrowStates = {};

        // Problem Timer
        this.problemTimerInterval = null;
        this.problemTimeRemaining = 0;
        this.problemTotalTime = 0;

        // Scratchpad
        this.isDrawing = false;
        this.scratchCtx = null;

        this.initDOM();
        this.bindEvents();
        this.updateMapUI();
    }

    // Default Save Data
    loadState() {
        const saved = localStorage.getItem(this.saveKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge defaults to ensure backwards compatibility
                return {
                    unlockedBooks: parsed.unlockedBooks || ['book_1'],
                    completedStages: parsed.completedStages || {},
                    xp: parsed.xp || 0,
                    level: parsed.level || 1,
                    starGems: parsed.starGems || 0,
                    potions: {
                        heal: parsed.potions?.heal ?? 3,
                        power: parsed.potions?.power ?? 2,
                        shield: parsed.potions?.shield ?? 2
                    },
                    unlockedArtifacts: parsed.unlockedArtifacts || [],
                    stageDigitOverrides: parsed.stageDigitOverrides || {},
                    settings: {
                        parentPasscode: parsed.settings?.parentPasscode || '',
                        digitsOverride: parsed.settings?.digitsOverride || 'auto', // 'auto', 1, 2, 3, 4
                        heroHpSetting: parsed.settings?.heroHpSetting || '5', // 3, 5, 8, 10, 99
                        monsterDmgMultiplier: parsed.settings?.monsterDmgMultiplier ?? 1, // 0, 1, 2
                        monsterHpScale: parsed.settings?.monsterHpScale ?? 1.0, // 0.5, 1.0, 1.5
                        problemTimer: parsed.settings?.problemTimer ?? 0, // 0 (off), 60, 45, 30, 15
                        unlimitedPotions: parsed.settings?.unlimitedPotions || false,
                        soundEnabled: parsed.settings?.soundEnabled ?? true
                    }
                };
            } catch (e) {
                console.error('Save parse error:', e);
            }
        }
        return {
            unlockedBooks: ['book_1'],
            completedStages: {},
            xp: 0,
            level: 1,
            starGems: 0,
            potions: {
                heal: 3,
                power: 2,
                shield: 2
            },
            unlockedArtifacts: [],
            stageDigitOverrides: {},
            settings: {
                parentPasscode: '',
                digitsOverride: 'auto',
                heroHpSetting: '5',
                monsterDmgMultiplier: 1,
                monsterHpScale: 1.0,
                problemTimer: 0,
                unlimitedPotions: false,
                soundEnabled: true
            }
        };
    }

    saveState() {
        localStorage.setItem(this.saveKey, JSON.stringify(this.state));
    }

    initDOM() {
        // Screens
        this.screens = {
            title: document.getElementById('screen-title'),
            map: document.getElementById('screen-map'),
            battle: document.getElementById('screen-battle')
        };

        // Modals
        this.modals = {
            victory: document.getElementById('modal-victory'),
            defeat: document.getElementById('modal-defeat'),
            parentGate: document.getElementById('modal-parent-gate'),
            settings: document.getElementById('modal-settings'),
            scratchpad: document.getElementById('scratchpad-modal')
        };

        // Battle Elements
        this.battleElements = {
            theater: document.getElementById('battle-theater'),
            titleIndicator: document.getElementById('battle-stage-title'),
            wavePills: document.getElementById('wave-progress-container'),
            heroHearts: document.getElementById('hero-hearts-row'),
            monsterHearts: document.getElementById('monster-hearts-row'),
            monsterName: document.getElementById('monster-name-plate'),
            monsterSprite: document.getElementById('monster-sprite-img'),
            heroSprite: document.getElementById('hero-sprite-img'),
            effectsLayer: document.getElementById('battle-effects-layer'),
            streakBanner: document.getElementById('streak-banner'),
            streakCountText: document.getElementById('streak-count-text'),
            
            // Timer Elements
            timerContainer: document.getElementById('battle-timer-container'),
            timerText: document.getElementById('battle-timer-text'),
            timerFill: document.getElementById('battle-timer-fill'),

            // Arithmetic Board
            columnMathGrid: document.getElementById('column-math-grid'),
            btnAttack: document.getElementById('btn-key-attack'),
            
            // Potions
            btnHeal: document.getElementById('btn-potion-heal'),
            btnPower: document.getElementById('btn-potion-power'),
            btnShield: document.getElementById('btn-potion-shield'),
            countHeal: document.getElementById('count-potion-heal'),
            countPower: document.getElementById('count-potion-power'),
            countShield: document.getElementById('count-potion-shield')
        };

        // Initialize Scratchpad Canvas
        const canvas = document.getElementById('scratchpad-canvas');
        if (canvas) {
            this.scratchCtx = canvas.getContext('2d');
            this.scratchCtx.strokeStyle = '#fef08a';
            this.scratchCtx.lineWidth = 4;
            this.scratchCtx.lineCap = 'round';
            this.scratchCtx.lineJoin = 'round';
        }
    }

    bindEvents() {
        // Title Screen buttons
        document.getElementById('btn-start-game')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.showScreen('map');
        });

        // Parent Gate Trigger
        document.getElementById('btn-open-settings')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.openParentGate();
        });

        // Parent Gate Unlock
        document.getElementById('btn-submit-parent-gate')?.addEventListener('click', () => {
            this.verifyParentGate();
        });

        document.getElementById('parent-gate-password')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.verifyParentGate();
            }
        });

        document.getElementById('btn-cancel-parent-gate')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.modals.parentGate.classList.remove('active');
        });

        // Navigation
        document.getElementById('btn-back-to-title')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.showScreen('title');
        });

        document.getElementById('btn-battle-quit')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            if (confirm('Return to map? Stage progress will be lost.')) {
                this.clearProblemTimer();
                this.showScreen('map');
            }
        });

        // Attack Button Click
        this.battleElements.btnAttack?.addEventListener('click', () => {
            this.submitAnswer();
        });

        // Potion Clicks
        this.battleElements.btnHeal?.addEventListener('click', () => this.usePotion('heal'));
        this.battleElements.btnPower?.addEventListener('click', () => this.usePotion('power'));
        this.battleElements.btnShield?.addEventListener('click', () => this.usePotion('shield'));

        // Helpers Toolbar
        document.getElementById('btn-toggle-scratchpad')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.openScratchpad();
        });

        document.getElementById('btn-close-scratchpad')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.modals.scratchpad.classList.remove('active');
        });

        document.getElementById('btn-clear-scratchpad')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.clearScratchpad();
        });

        // Scratchpad Drawing
        const canvas = document.getElementById('scratchpad-canvas');
        if (canvas) {
            const startDraw = (e) => {
                this.isDrawing = true;
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
                const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
                this.scratchCtx.beginPath();
                this.scratchCtx.moveTo(x, y);
            };

            const draw = (e) => {
                if (!this.isDrawing) return;
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
                const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
                this.scratchCtx.lineTo(x, y);
                this.scratchCtx.stroke();
            };

            const stopDraw = () => {
                this.isDrawing = false;
            };

            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', draw);
            window.addEventListener('mouseup', stopDraw);

            canvas.addEventListener('touchstart', startDraw, { passive: true });
            canvas.addEventListener('touchmove', draw, { passive: true });
            window.addEventListener('touchend', stopDraw);
        }

        // Victory / Defeat Modal Buttons
        document.getElementById('btn-victory-next')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.modals.victory.classList.remove('active');
            this.showScreen('map');
            this.updateMapUI();
        });

        document.getElementById('btn-defeat-retry')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.modals.defeat.classList.remove('active');
            this.startStage(this.currentBook, this.currentStage);
        });

        document.getElementById('btn-defeat-map')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.modals.defeat.classList.remove('active');
            this.showScreen('map');
        });

        // Parent Dashboard Tab Buttons
        document.querySelectorAll('.parent-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.getAttribute('data-tab');
                this.switchParentTab(targetTab);
            });
        });

        // Quick Stage Presets
        document.getElementById('btn-preset-all-1')?.addEventListener('click', () => this.applyQuickDigitPreset(1));
        document.getElementById('btn-preset-all-2')?.addEventListener('click', () => this.applyQuickDigitPreset(2));
        document.getElementById('btn-preset-all-3')?.addEventListener('click', () => this.applyQuickDigitPreset(3));
        document.getElementById('btn-preset-reset')?.addEventListener('click', () => this.applyQuickDigitPreset('default'));

        // Action Buttons in Parent Dashboard
        document.getElementById('btn-unlock-all-stages')?.addEventListener('click', () => {
            this.unlockAllStages();
        });

        document.getElementById('btn-refill-inventory')?.addEventListener('click', () => {
            this.refillInventory();
        });

        document.getElementById('btn-reset-game-progress')?.addEventListener('click', () => {
            this.resetGameProgress();
        });

        // Settings Modal Save & Close
        document.getElementById('btn-save-settings')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.saveSettingsFromForm();
            this.modals.settings.classList.remove('active');
            this.updateMapUI();
        });

        document.getElementById('btn-close-settings')?.addEventListener('click', () => {
            soundFX.playButtonClick();
            this.modals.settings.classList.remove('active');
        });
    }

    showScreen(screenName) {
        this.clearProblemTimer();
        Object.keys(this.screens).forEach(key => {
            this.screens[key].classList.toggle('active', key === screenName);
        });
    }

    // =========================================================
    // PARENT SECURITY GATE & DASHBOARD
    // =========================================================

    getTodayPasscodes() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const dayNoPad = String(now.getDate());
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const monthNoPad = String(now.getMonth() + 1);
        const year = String(now.getFullYear());

        return [
            `${day}-${month}-${year}`,          // e.g. "01-10-2026"
            `${day}/${month}/${year}`,          // e.g. "01/10/2026"
            `${day}.${month}.${year}`,          // e.g. "01.10.2026"
            `${day}${month}${year}`,            // e.g. "01102026"
            `${dayNoPad}-${monthNoPad}-${year}`, // e.g. "1-10-2026"
            `${dayNoPad}/${monthNoPad}/${year}`  // e.g. "1/10/2026"
        ];
    }

    openParentGate() {
        const passInput = document.getElementById('parent-gate-password');
        const errEl = document.getElementById('parent-gate-error');
        if (passInput) passInput.value = '';
        if (errEl) errEl.textContent = '';
        this.modals.parentGate.classList.add('active');
        setTimeout(() => passInput?.focus(), 100);
    }

    verifyParentGate() {
        const passInput = document.getElementById('parent-gate-password');
        const errEl = document.getElementById('parent-gate-error');
        const entered = passInput ? passInput.value.trim() : '';
        const validDates = this.getTodayPasscodes();
        const customPass = this.state.settings.parentPasscode?.trim();

        const isMatch = validDates.includes(entered) || (customPass && entered === customPass);

        if (isMatch) {
            soundFX.playVictoryFanfare();
            this.modals.parentGate.classList.remove('active');
            this.openSettingsDashboard();
        } else {
            soundFX.playHeroHurt();
            if (errEl) errEl.textContent = '❌ Incorrect Passcode. Enter today\'s date (e.g. 01-10-2026).';
            const card = document.querySelector('.parent-gate-card');
            if (card) {
                card.classList.add('hit-recoil');
                setTimeout(() => card.classList.remove('hit-recoil'), 450);
            }
            passInput?.select();
        }
    }

    openSettingsDashboard() {
        // Load Form Values
        document.getElementById('select-global-digits').value = this.state.settings.digitsOverride || 'auto';
        document.getElementById('select-hero-hp').value = this.state.settings.heroHpSetting || '5';
        document.getElementById('select-monster-dmg').value = String(this.state.settings.monsterDmgMultiplier ?? 1);
        document.getElementById('select-monster-hp-scale').value = String(this.state.settings.monsterHpScale ?? 1.0);
        document.getElementById('select-problem-timer').value = String(this.state.settings.problemTimer ?? 0);
        document.getElementById('check-unlimited-potions').checked = !!this.state.settings.unlimitedPotions;
        document.getElementById('check-sound-enabled').checked = this.state.settings.soundEnabled !== false;
        document.getElementById('input-new-passcode').value = this.state.settings.parentPasscode || '';

        // Render Stage-by-Stage Customizers
        this.renderStageDigitCustomizers();

        // Open modal and switch to default tab
        this.switchParentTab('tab-stage-digits');
        this.modals.settings.classList.add('active');
    }

    switchParentTab(tabId) {
        document.querySelectorAll('.parent-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        document.querySelectorAll('.parent-tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });
    }

    renderStageDigitCustomizers() {
        const container = document.getElementById('stage-digits-customizer-container');
        if (!container) return;
        container.innerHTML = '';

        GAME_DATA.books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-setting-accordion-group';
            bookCard.innerHTML = `
                <div class="book-setting-header">
                    <h4>${book.title}</h4>
                    <span class="book-setting-sub">${book.subtitle}</span>
                </div>
                <div class="stages-setting-grid" id="book-stages-grid-${book.id}"></div>
            `;
            container.appendChild(bookCard);

            const grid = bookCard.querySelector(`#book-stages-grid-${book.id}`);
            book.stages.forEach(stage => {
                const currentVal = this.state.stageDigitOverrides[stage.id] || 'default';
                const row = document.createElement('div');
                row.className = 'stage-setting-item';
                row.innerHTML = `
                    <div class="stage-setting-meta">
                        <span class="stage-num">${stage.number}</span>
                        <span class="stage-name">${stage.name}</span>
                        <span class="stage-default-tag">(Default: ${stage.digits} Digits)</span>
                    </div>
                    <select class="stage-digit-select setting-select" data-stage-id="${stage.id}">
                        <option value="default" ${currentVal === 'default' ? 'selected' : ''}>Default (${stage.digits}D)</option>
                        <option value="1" ${currentVal === '1' ? 'selected' : ''}>1 Digit</option>
                        <option value="2" ${currentVal === '2' ? 'selected' : ''}>2 Digits</option>
                        <option value="3" ${currentVal === '3' ? 'selected' : ''}>3 Digits</option>
                        <option value="4" ${currentVal === '4' ? 'selected' : ''}>4 Digits</option>
                    </select>
                `;
                grid.appendChild(row);
            });
        });
    }

    applyQuickDigitPreset(val) {
        soundFX.playButtonClick();
        document.querySelectorAll('.stage-digit-select').forEach(select => {
            select.value = String(val);
        });
    }

    saveSettingsFromForm() {
        this.state.settings.digitsOverride = document.getElementById('select-global-digits').value;
        this.state.settings.heroHpSetting = document.getElementById('select-hero-hp').value;
        this.state.settings.monsterDmgMultiplier = parseFloat(document.getElementById('select-monster-dmg').value);
        this.state.settings.monsterHpScale = parseFloat(document.getElementById('select-monster-hp-scale').value);
        this.state.settings.problemTimer = parseInt(document.getElementById('select-problem-timer').value, 10);
        this.state.settings.unlimitedPotions = document.getElementById('check-unlimited-potions').checked;
        this.state.settings.soundEnabled = document.getElementById('check-sound-enabled').checked;

        const newPass = document.getElementById('input-new-passcode').value.trim();
        if (newPass.length > 0) {
            this.state.settings.parentPasscode = newPass;
        }

        // Save stage digit overrides
        this.state.stageDigitOverrides = {};
        document.querySelectorAll('.stage-digit-select').forEach(select => {
            const stageId = select.getAttribute('data-stage-id');
            const val = select.value;
            if (val !== 'default') {
                this.state.stageDigitOverrides[stageId] = val;
            }
        });

        this.saveState();
        alert('Settings successfully saved and applied!');
    }

    unlockAllStages() {
        GAME_DATA.books.forEach(b => {
            if (!this.state.unlockedBooks.includes(b.id)) {
                this.state.unlockedBooks.push(b.id);
            }
            b.stages.forEach(s => {
                if (!this.state.completedStages[s.id]) {
                    this.state.completedStages[s.id] = { stars: 3, score: 200 };
                }
            });
        });
        this.state.level = 10;
        this.state.starGems = 100;
        this.saveState();
        soundFX.playVictoryFanfare();
        alert('🌟 All Books & Stages have been unlocked!');
        this.updateMapUI();
    }

    refillInventory() {
        this.state.potions.heal = 10;
        this.state.potions.power = 10;
        this.state.potions.shield = 10;
        this.state.starGems += 50;
        this.saveState();
        soundFX.playChestOpen();
        alert('🧪 Potions and Star Gems have been refilled!');
        this.updateMapUI();
    }

    resetGameProgress() {
        if (confirm('⚠️ Are you sure you want to reset ALL game progress? This will lock all stages and clear stats.')) {
            const currentPass = this.state.settings.parentPasscode;
            this.state = {
                unlockedBooks: ['book_1'],
                completedStages: {},
                xp: 0,
                level: 1,
                starGems: 0,
                potions: { heal: 3, power: 2, shield: 2 },
                unlockedArtifacts: [],
                stageDigitOverrides: {},
                settings: {
                    parentPasscode: currentPass || '',
                    digitsOverride: 'auto',
                    heroHpSetting: '5',
                    monsterDmgMultiplier: 1,
                    monsterHpScale: 1.0,
                    problemTimer: 0,
                    unlimitedPotions: false,
                    soundEnabled: true
                }
            };
            this.saveState();
            soundFX.playDefeatSound();
            alert('Game progress has been reset.');
            this.updateMapUI();
            this.modals.settings.classList.remove('active');
        }
    }

    // =========================================================
    // MAP & STAGE MANAGEMENT
    // =========================================================

    updateMapUI() {
        const booksContainer = document.getElementById('books-grid-container');
        if (!booksContainer) return;
        booksContainer.innerHTML = '';

        // Update stats pill
        document.getElementById('stat-star-gems').textContent = this.state.starGems;
        document.getElementById('stat-player-level').textContent = `Lv. ${this.state.level}`;

        GAME_DATA.books.forEach((book) => {
            const isUnlocked = this.state.unlockedBooks.includes(book.id);
            const bookCard = document.createElement('div');
            bookCard.className = `book-card ${isUnlocked ? 'unlocked' : 'locked'}`;

            let completedCount = 0;
            let totalStars = 0;
            book.stages.forEach(s => {
                if (this.state.completedStages[s.id]) {
                    completedCount++;
                    totalStars += this.state.completedStages[s.id].stars || 0;
                }
            });

            bookCard.innerHTML = `
                <div class="book-card-cover" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('${book.bgImage}')">
                    <div class="book-card-badge">${isUnlocked ? `⭐ ${totalStars} Stars` : '🔒 Locked'}</div>
                </div>
                <div class="book-card-info">
                    <h3>${book.title}</h3>
                    <div class="subtitle">${book.subtitle}</div>
                    <p>${book.description}</p>
                    <div class="stages-list" id="stages-list-${book.id}"></div>
                </div>
            `;

            booksContainer.appendChild(bookCard);

            // Populate Stage Buttons
            const stagesList = bookCard.querySelector(`#stages-list-${book.id}`);
            book.stages.forEach((stage, sIdx) => {
                const isStageCompleted = !!this.state.completedStages[stage.id];
                const isStageUnlocked = isUnlocked && (sIdx === 0 || !!this.state.completedStages[book.stages[sIdx - 1].id]);

                const dot = document.createElement('div');
                dot.className = `stage-dot ${isStageCompleted ? 'completed' : ''} ${stage.isBoss ? 'boss' : ''}`;
                dot.textContent = stage.number.replace(' (BOSS)', '').replace(' (FINAL BOSS)', '');
                
                // Show digit count in title tooltip
                const activeDigits = this.getEffectiveDigitsForStage(stage);
                dot.title = `${stage.name} (${activeDigits} Digits - ${stage.operationType})`;

                if (isStageUnlocked) {
                    dot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        soundFX.playButtonClick();
                        this.startStage(book, stage);
                    });
                } else {
                    dot.style.opacity = '0.35';
                    dot.style.cursor = 'not-allowed';
                }

                stagesList.appendChild(dot);
            });
        });
    }

    getEffectiveDigitsForStage(stage) {
        // 1. Stage-specific override
        if (this.state.stageDigitOverrides && this.state.stageDigitOverrides[stage.id]) {
            const overrideVal = parseInt(this.state.stageDigitOverrides[stage.id], 10);
            if (!isNaN(overrideVal)) return overrideVal;
        }
        // 2. Global override
        if (this.state.settings.digitsOverride && this.state.settings.digitsOverride !== 'auto') {
            const globalVal = parseInt(this.state.settings.digitsOverride, 10);
            if (!isNaN(globalVal)) return globalVal;
        }
        // 3. Stage default
        return stage.digits || 2;
    }

    startStage(book, stage) {
        this.currentBook = book;
        this.currentStage = stage;
        this.currentWaveIndex = 0;
        this.streak = 0;
        this.powerPotionActive = false;
        this.shieldPotionActive = false;

        // Apply starting HP from parent settings
        const customHp = parseInt(this.state.settings.heroHpSetting || '5', 10);
        this.heroMaxHp = isNaN(customHp) ? 5 : customHp;

        // Apply bonus artifact stats
        if (this.state.unlockedArtifacts.includes('Amulet of the Forest')) {
            this.heroMaxHp += 1;
        }
        if (this.state.unlockedArtifacts.includes('Crown of Arithmetic Champion')) {
            this.heroMaxHp += 2;
        }
        this.heroHp = this.heroMaxHp;

        // Update Theater background
        this.battleElements.theater.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%), url('${book.bgImage}')`;
        this.battleElements.titleIndicator.textContent = `${book.title.split(':')[0]} - Stage ${stage.number}`;

        this.showScreen('battle');
        this.loadWave(0);
    }

    loadWave(waveIdx) {
        this.currentWaveIndex = waveIdx;
        this.currentMonster = this.currentStage.waves[waveIdx];
        
        // Scale monster HP based on settings
        const hpScale = this.state.settings.monsterHpScale ?? 1.0;
        this.monsterHp = Math.max(1, Math.round(this.currentMonster.maxHp * hpScale));

        // Update UI
        this.renderWaveProgress();
        this.renderHearts();
        this.updatePotionsUI();
        this.updateStreakUI();

        this.battleElements.monsterName.textContent = `${this.currentMonster.name} (${this.currentMonster.title})`;
        this.battleElements.monsterSprite.src = this.currentMonster.sprite;
        this.battleElements.monsterSprite.className = 'sprite-img monster-idle';
        this.battleElements.heroSprite.className = 'sprite-img hero-idle';

        this.nextMathQuestion();
    }

    renderWaveProgress() {
        const container = this.battleElements.wavePills;
        container.innerHTML = '';
        this.currentStage.waves.forEach((_, idx) => {
            const pill = document.createElement('div');
            pill.className = `wave-pill ${idx === this.currentWaveIndex ? 'active' : idx < this.currentWaveIndex ? 'cleared' : ''}`;
            container.appendChild(pill);
        });
    }

    renderHearts() {
        // Hero Hearts
        const heroRow = this.battleElements.heroHearts;
        heroRow.innerHTML = '';
        if (this.heroMaxHp >= 99) {
            heroRow.innerHTML = '<span class="stat-pill" style="background:#059669; color:#fff; font-weight:800;">💖 INVINCIBLE</span>';
        } else {
            for (let i = 0; i < this.heroMaxHp; i++) {
                const span = document.createElement('span');
                span.className = `heart-icon ${i < this.heroHp ? 'full' : 'lost'}`;
                span.textContent = '💖';
                heroRow.appendChild(span);
            }
        }

        // Monster Hearts
        const monsterRow = this.battleElements.monsterHearts;
        monsterRow.innerHTML = '';
        const hpScale = this.state.settings.monsterHpScale ?? 1.0;
        const maxDisplayHp = Math.max(1, Math.round(this.currentMonster.maxHp * hpScale));

        for (let i = 0; i < maxDisplayHp; i++) {
            const span = document.createElement('span');
            span.className = `heart-icon ${i < this.monsterHp ? 'full' : 'lost'}`;
            span.textContent = this.currentStage.isBoss ? '💜' : '💔';
            monsterRow.appendChild(span);
        }
    }

    updatePotionsUI() {
        const p = this.state.potions;
        const isUnlimited = !!this.state.settings.unlimitedPotions;

        this.battleElements.countHeal.textContent = isUnlimited ? '∞' : `x${p.heal}`;
        this.battleElements.countPower.textContent = isUnlimited ? '∞' : `x${p.power}`;
        this.battleElements.countShield.textContent = isUnlimited ? '∞' : `x${p.shield}`;

        this.battleElements.btnHeal.disabled = (!isUnlimited && p.heal <= 0) || this.heroHp >= this.heroMaxHp;
        this.battleElements.btnPower.disabled = (!isUnlimited && p.power <= 0) || this.powerPotionActive;
        this.battleElements.btnShield.disabled = (!isUnlimited && p.shield <= 0) || this.shieldPotionActive;
    }

    updateStreakUI() {
        if (this.streak >= 2) {
            this.battleElements.streakBanner.style.display = 'flex';
            const multiplier = this.streak >= 5 ? '2.5x CRITICAL!' : this.streak >= 3 ? '1.5x FLAME!' : '1.25x';
            this.battleElements.streakCountText.textContent = `Streak ${this.streak}x (${multiplier})`;
        } else {
            this.battleElements.streakBanner.style.display = 'none';
        }
    }

    // =========================================================
    // PROBLEM TIMER
    // =========================================================

    startProblemTimer() {
        this.clearProblemTimer();
        const durationSec = this.state.settings.problemTimer || 0;

        if (durationSec <= 0) {
            if (this.battleElements.timerContainer) {
                this.battleElements.timerContainer.style.display = 'none';
            }
            return;
        }

        if (this.battleElements.timerContainer) {
            this.battleElements.timerContainer.style.display = 'flex';
        }

        this.problemTotalTime = durationSec;
        this.problemTimeRemaining = durationSec;
        this.updateTimerDisplay();

        this.problemTimerInterval = setInterval(() => {
            if (this.isProcessingTurn) return;

            this.problemTimeRemaining--;
            this.updateTimerDisplay();

            if (this.problemTimeRemaining <= 0) {
                this.clearProblemTimer();
                soundFX.playMonsterAttack();
                this.spawnDamagePopup('⏱️ TIME OUT!', 'hero', 'crit');
                this.handleMonsterAttack();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        if (!this.battleElements.timerText || !this.battleElements.timerFill) return;
        this.battleElements.timerText.textContent = `${this.problemTimeRemaining}s`;
        const percentage = Math.max(0, (this.problemTimeRemaining / this.problemTotalTime) * 100);
        this.battleElements.timerFill.style.width = `${percentage}%`;

        if (percentage <= 25) {
            this.battleElements.timerFill.style.backgroundColor = '#ef4444';
        } else if (percentage <= 50) {
            this.battleElements.timerFill.style.backgroundColor = '#f59e0b';
        } else {
            this.battleElements.timerFill.style.backgroundColor = '#38bdf8';
        }
    }

    clearProblemTimer() {
        if (this.problemTimerInterval) {
            clearInterval(this.problemTimerInterval);
            this.problemTimerInterval = null;
        }
    }

    // =========================================================
    // ARITHMETIC BOARD & INTERACTION
    // =========================================================

    nextMathQuestion() {
        this.carryStates = {};
        this.borrowStates = {};

        const effectiveDigits = this.getEffectiveDigitsForStage(this.currentStage);
        this.currentProblem = MathEngine.generateForStage(this.currentStage, effectiveDigits);
        this.renderArithmeticBoard();
        this.startProblemTimer();
    }

    renderArithmeticBoard() {
        const prob = this.currentProblem;
        const grid = this.battleElements.columnMathGrid;
        grid.innerHTML = '';

        const totalCols = prob.maxCols;
        const colNames = ['O', 'T', 'H', 'Th', 'T-Th'];

        // Operator sign
        const opSign = document.createElement('div');
        opSign.className = 'grid-operator-sign';
        opSign.textContent = prob.operator;
        grid.appendChild(opSign);

        // 1. CARRY BUBBLES ROW
        const carryRow = document.createElement('div');
        carryRow.className = 'grid-carry-row';

        for (let col = totalCols - 1; col >= 0; col--) {
            const cell = document.createElement('div');
            cell.className = 'math-col-cell';

            if (prob.operator === '+' && col > 0) {
                const bubble = document.createElement('button');
                bubble.type = 'button';
                bubble.className = 'carry-bubble-btn';
                bubble.id = `carry-bubble-${col}`;
                bubble.title = `Toggle Carry (+1)`;
                bubble.textContent = '';

                bubble.addEventListener('click', () => {
                    soundFX.playRegroupChime();
                    bubble.classList.toggle('active');
                    bubble.textContent = bubble.classList.contains('active') ? '+1' : '';
                    this.carryStates[col] = bubble.classList.contains('active');
                });
                cell.appendChild(bubble);
            } else {
                const emptySpacer = document.createElement('div');
                emptySpacer.className = 'carry-bubble-btn hidden';
                cell.appendChild(emptySpacer);
            }
            carryRow.appendChild(cell);
        }
        grid.appendChild(carryRow);

        // 2. TOP DIGITS ROW
        const topDigitsRow = document.createElement('div');
        topDigitsRow.className = 'grid-digits-row';
        topDigitsRow.id = 'grid-top-digits-row';

        for (let col = totalCols - 1; col >= 0; col--) {
            const cell = document.createElement('div');
            cell.className = 'math-col-cell';

            const digitVal = prob.topStr.length > col 
                ? prob.topStr[prob.topStr.length - 1 - col] 
                : '';

            const span = document.createElement('span');
            span.className = 'digit-cell-value';
            span.id = `top-digit-col-${col}`;
            span.textContent = digitVal;

            // In Subtraction, allow child to strike higher columns to borrow 1
            if (prob.operator === '-' && col > 0 && digitVal && parseInt(digitVal, 10) > 0) {
                span.classList.add('borrow-strikeable');
                span.title = 'Click to Borrow 1 from here!';
                const reduced = parseInt(digitVal, 10) - 1;
                span.setAttribute('data-reduced', reduced);

                span.addEventListener('click', () => {
                    soundFX.playRegroupChime();
                    span.classList.toggle('borrow-struck');
                    this.borrowStates[col] = span.classList.contains('borrow-struck');

                    const rightColEl = document.getElementById(`top-digit-col-${col - 1}`);
                    if (rightColEl) {
                        rightColEl.classList.toggle('borrow-receiver', this.borrowStates[col]);
                        rightColEl.classList.toggle('regrouped', this.borrowStates[col]);
                    }
                });
            }

            cell.appendChild(span);
            topDigitsRow.appendChild(cell);
        }
        grid.appendChild(topDigitsRow);

        // 3. BOTTOM DIGITS ROW
        const bottomDigitsRow = document.createElement('div');
        bottomDigitsRow.className = 'grid-digits-row';

        for (let col = totalCols - 1; col >= 0; col--) {
            const cell = document.createElement('div');
            cell.className = 'math-col-cell';

            const digitVal = prob.bottomStr.length > col 
                ? prob.bottomStr[prob.bottomStr.length - 1 - col] 
                : '';

            const span = document.createElement('span');
            span.className = 'digit-cell-value';
            span.textContent = digitVal;

            cell.appendChild(span);
            bottomDigitsRow.appendChild(cell);
        }
        grid.appendChild(bottomDigitsRow);

        // 4. DIVIDER LINE
        const divider = document.createElement('div');
        divider.className = 'grid-divider-line';
        grid.appendChild(divider);

        // 5. INDIVIDUAL COLUMN INPUT PLACEHOLDERS ROW
        const inputsRow = document.createElement('div');
        inputsRow.className = 'grid-inputs-row';
        this.inputElements = [];

        for (let col = totalCols - 1; col >= 0; col--) {
            const cell = document.createElement('div');
            cell.className = 'math-col-cell';

            const input = document.createElement('input');
            input.type = 'tel';
            input.maxLength = 1;
            input.inputMode = 'numeric';
            input.pattern = '[0-9]*';
            input.className = 'column-digit-input';
            input.id = `input-col-${col}`;
            input.setAttribute('data-col', col);
            input.placeholder = colNames[col] || '?';

            // Auto-advance input events
            input.addEventListener('input', (e) => {
                const val = input.value.replace(/[^0-9]/g, '');
                input.value = val;
                if (val.length === 1) {
                    soundFX.playKeypadTap(val);
                    // Shift focus to the next column to the left (col + 1)
                    if (col + 1 < totalCols) {
                        const nextInput = document.getElementById(`input-col-${col + 1}`);
                        if (nextInput) nextInput.focus();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && input.value === '') {
                    // Shift focus back to the column to the right (col - 1)
                    if (col > 0) {
                        const prevInput = document.getElementById(`input-col-${col - 1}`);
                        if (prevInput) {
                            prevInput.focus();
                            prevInput.value = '';
                        }
                    }
                } else if (e.key === 'ArrowLeft') {
                    if (col + 1 < totalCols) {
                        document.getElementById(`input-col-${col + 1}`)?.focus();
                    }
                } else if (e.key === 'ArrowRight') {
                    if (col > 0) {
                        document.getElementById(`input-col-${col - 1}`)?.focus();
                    }
                } else if (e.key === 'Enter') {
                    this.submitAnswer();
                }
            });

            cell.appendChild(input);
            inputsRow.appendChild(cell);
            this.inputElements[col] = input;
        }
        grid.appendChild(inputsRow);

        // Autofocus the Ones column input (col = 0)
        setTimeout(() => {
            const onesInput = document.getElementById('input-col-0');
            if (onesInput) {
                onesInput.focus();
            }
        }, 80);
    }

    usePotion(potionType) {
        const isUnlimited = !!this.state.settings.unlimitedPotions;
        if (!isUnlimited && this.state.potions[potionType] <= 0) return;

        if (!isUnlimited) {
            this.state.potions[potionType]--;
            this.saveState();
        }

        if (potionType === 'heal') {
            soundFX.playPotionHeal();
            this.heroHp = Math.min(this.heroMaxHp, this.heroHp + 2);
            this.renderHearts();
            this.spawnDamagePopup('+2 HEAL ❤️', 'hero', 'heal');
        } else if (potionType === 'power') {
            soundFX.playPotionPower();
            this.powerPotionActive = true;
            this.spawnDamagePopup('⚡ 2x POWER!', 'hero', 'shield');
        } else if (potionType === 'shield') {
            soundFX.playShieldBlock();
            this.shieldPotionActive = true;
            this.spawnDamagePopup('🛡️ SHIELD ACTIVE', 'hero', 'shield');
        }

        this.updatePotionsUI();
    }

    submitAnswer() {
        if (this.isProcessingTurn) return;

        // Gather digits from columns from left (highest col) to right (0 = Ones)
        let assembledStr = '';
        for (let col = this.currentProblem.maxCols - 1; col >= 0; col--) {
            const input = document.getElementById(`input-col-${col}`);
            if (input && input.value !== '') {
                assembledStr += input.value;
            }
        }

        if (assembledStr.trim() === '') {
            // Shake inputs to remind player
            const inputsRow = document.querySelector('.grid-inputs-row');
            if (inputsRow) {
                inputsRow.classList.add('hit-recoil');
                setTimeout(() => inputsRow.classList.remove('hit-recoil'), 400);
            }
            return;
        }

        const inputVal = parseInt(assembledStr, 10);
        if (isNaN(inputVal)) return;

        this.isProcessingTurn = true;
        this.clearProblemTimer();
        const isCorrect = inputVal === this.currentProblem.answer;

        if (isCorrect) {
            this.handleHeroAttack();
        } else {
            this.handleMonsterAttack();
        }
    }

    handleHeroAttack() {
        this.streak++;
        this.updateStreakUI();

        let damage = 2;
        let isCrit = false;

        if (this.streak >= 5) {
            damage = 4;
            isCrit = true;
        } else if (this.streak >= 3) {
            damage = 3;
        }

        if (this.powerPotionActive) {
            damage *= 2;
            this.powerPotionActive = false;
            isCrit = true;
        }

        // Trigger Hero Slash Animation & Sound
        if (isCrit) {
            soundFX.playCriticalHit();
        } else {
            soundFX.playSwordSlash();
        }

        this.battleElements.heroSprite.className = 'sprite-img hero-attack';

        setTimeout(() => {
            // Monster takes hit
            soundFX.playMonsterHit();
            this.battleElements.monsterSprite.className = 'sprite-img hit-recoil';
            this.monsterHp = Math.max(0, this.monsterHp - damage);
            this.renderHearts();

            this.spawnDamagePopup(`-${damage} HP${isCrit ? ' CRITICAL!' : ''}`, 'monster', isCrit ? 'crit' : 'normal');

            setTimeout(() => {
                this.battleElements.heroSprite.className = 'sprite-img hero-idle';
                this.battleElements.monsterSprite.className = 'sprite-img monster-idle';

                if (this.monsterHp <= 0) {
                    this.handleMonsterDefeat();
                } else {
                    this.isProcessingTurn = false;
                    this.nextMathQuestion();
                }
            }, 500);
        }, 350);
    }

    handleMonsterAttack() {
        this.streak = 0;
        this.updateStreakUI();

        // Monster Attack animation
        soundFX.playMonsterAttack();
        this.battleElements.monsterSprite.className = 'sprite-img monster-attack';

        setTimeout(() => {
            if (this.shieldPotionActive) {
                // Shield blocks
                soundFX.playShieldBlock();
                this.shieldPotionActive = false;
                this.spawnDamagePopup('🛡️ BLOCKED!', 'hero', 'shield');
            } else {
                // Hero takes damage based on parent monster dmg multiplier
                const dmgMultiplier = this.state.settings.monsterDmgMultiplier ?? 1;
                const baseDmg = this.currentMonster.attackPower || 1;
                const finalDmg = Math.round(baseDmg * dmgMultiplier);

                if (finalDmg > 0 && this.heroMaxHp < 99) {
                    soundFX.playHeroHurt();
                    this.battleElements.heroSprite.className = 'sprite-img hit-recoil';
                    this.heroHp = Math.max(0, this.heroHp - finalDmg);
                    this.renderHearts();
                    this.spawnDamagePopup(`-${finalDmg} 💔`, 'hero', 'normal');
                } else {
                    this.spawnDamagePopup('0 DMG (Safe Mode)', 'hero', 'shield');
                }
            }

            setTimeout(() => {
                this.battleElements.monsterSprite.className = 'sprite-img monster-idle';
                this.battleElements.heroSprite.className = 'sprite-img hero-idle';

                if (this.heroHp <= 0 && this.heroMaxHp < 99) {
                    this.handleGameOver();
                } else {
                    this.isProcessingTurn = false;
                    // Clear inputs for retry
                    for (let col = 0; col < this.currentProblem.maxCols; col++) {
                        const input = document.getElementById(`input-col-${col}`);
                        if (input) input.value = '';
                    }
                    document.getElementById('input-col-0')?.focus();
                    this.startProblemTimer();
                }
            }, 500);
        }, 350);
    }

    handleMonsterDefeat() {
        this.clearProblemTimer();
        this.battleElements.monsterSprite.className = 'sprite-img defeat-poof';
        soundFX.playComboUp(this.streak);

        setTimeout(() => {
            if (this.currentWaveIndex + 1 < this.currentStage.waves.length) {
                // Advance to next wave
                this.loadWave(this.currentWaveIndex + 1);
                this.isProcessingTurn = false;
            } else {
                // Stage Complete!
                this.handleStageVictory();
            }
        }, 800);
    }

    handleStageVictory() {
        this.clearProblemTimer();
        soundFX.playVictoryFanfare();
        soundFX.playChestOpen();

        // Calculate stars
        let stars = 3;
        if (this.heroHp < this.heroMaxHp) stars = 2;
        if (this.heroHp <= 1) stars = 1;

        // Rewards
        const xpEarned = this.currentStage.rewardXp || 100;
        const gemsEarned = this.currentStage.rewardStars || 3;
        this.state.xp += xpEarned;
        this.state.starGems += gemsEarned;
        this.state.potions.heal += 1;

        // Level up check
        this.state.level = Math.floor(this.state.xp / 150) + 1;

        // Save stage completion
        this.state.completedStages[this.currentStage.id] = {
            stars,
            score: xpEarned
        };

        // Unlock next book if this was boss
        if (this.currentStage.isBoss) {
            const nextBookIndex = GAME_DATA.books.findIndex(b => b.id === this.currentBook.id) + 1;
            if (nextBookIndex < GAME_DATA.books.length) {
                const nextBookId = GAME_DATA.books[nextBookIndex].id;
                if (!this.state.unlockedBooks.includes(nextBookId)) {
                    this.state.unlockedBooks.push(nextBookId);
                }
            }
            if (this.currentStage.artifactUnlock) {
                if (!this.state.unlockedArtifacts.includes(this.currentStage.artifactUnlock.name)) {
                    this.state.unlockedArtifacts.push(this.currentStage.artifactUnlock.name);
                }
            }
        }

        this.saveState();

        // Render Victory Modal
        document.getElementById('victory-stars-display').textContent = '⭐'.repeat(stars);
        document.getElementById('victory-xp-text').textContent = `+${xpEarned} XP`;
        document.getElementById('victory-gems-text').textContent = `+${gemsEarned} Gems`;

        const artifactContainer = document.getElementById('victory-artifact-container');
        if (this.currentStage.artifactUnlock) {
            artifactContainer.style.display = 'block';
            document.getElementById('victory-artifact-name').textContent = `${this.currentStage.artifactUnlock.icon} ${this.currentStage.artifactUnlock.name}`;
            document.getElementById('victory-artifact-desc').textContent = this.currentStage.artifactUnlock.effect;
        } else {
            artifactContainer.style.display = 'none';
        }

        this.modals.victory.classList.add('active');
        this.isProcessingTurn = false;
    }

    handleGameOver() {
        this.clearProblemTimer();
        soundFX.playDefeatSound();
        this.modals.defeat.classList.add('active');
        this.isProcessingTurn = false;
    }

    spawnDamagePopup(text, target = 'monster', type = 'normal') {
        const popup = document.createElement('div');
        popup.className = `damage-number ${type}`;
        popup.textContent = text;

        const isMonster = target === 'monster';
        popup.style.left = isMonster ? '72%' : '20%';
        popup.style.top = '40%';

        this.battleElements.effectsLayer.appendChild(popup);
        setTimeout(() => popup.remove(), 1000);
    }

    openScratchpad() {
        this.modals.scratchpad.classList.add('active');
        const canvas = document.getElementById('scratchpad-canvas');
        if (canvas) {
            canvas.width = canvas.parentElement.clientWidth - 40;
            canvas.height = 320;
            this.clearScratchpad();
        }
    }

    clearScratchpad() {
        const canvas = document.getElementById('scratchpad-canvas');
        if (canvas && this.scratchCtx) {
            this.scratchCtx.fillStyle = '#022c22';
            this.scratchCtx.fillRect(0, 0, canvas.width, canvas.height);
            this.scratchCtx.strokeStyle = '#fef08a';
            this.scratchCtx.lineWidth = 4;
        }
    }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new GameApp();
});
