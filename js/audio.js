// Procedural Web Audio Synthesizer for Math Knight Adventures (Bookworm Adventures style)

class SoundFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.musicEnabled = false;
        this.musicInterval = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2, startTime = 0) {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = this.ctx.currentTime + startTime;

            osc.type = type;
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(gainVal, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + duration);
        } catch (e) {
            console.warn('Audio tone error:', e);
        }
    }

    playSwordSlash() {
        this.init();
        if (this.muted || !this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 0.2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.18);
            filter.Q.value = 3;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();

            // Tone underneath for whoosh
            this.playTone(450, 'sawtooth', 0.15, 0.15);
        } catch (e) {}
    }

    playCriticalHit() {
        this.init();
        if (this.muted || !this.ctx) return;
        this.playSwordSlash();
        setTimeout(() => {
            this.playTone(200, 'triangle', 0.4, 0.4);
            this.playTone(600, 'square', 0.25, 0.25);
            this.playTone(900, 'sine', 0.35, 0.3, 0.05);
            this.playTone(1200, 'sine', 0.4, 0.3, 0.1);
        }, 80);
    }

    playMonsterHit() {
        this.init();
        if (this.muted || !this.ctx) return;
        this.playTone(180, 'sawtooth', 0.18, 0.25);
        this.playTone(120, 'square', 0.22, 0.2, 0.04);
    }

    playMonsterAttack() {
        this.init();
        if (this.muted || !this.ctx) return;
        // Heavy claw / slam sound
        this.playTone(140, 'sawtooth', 0.25, 0.3);
        this.playTone(90, 'triangle', 0.3, 0.4, 0.05);
    }

    playHeroHurt() {
        this.init();
        if (this.muted || !this.ctx) return;
        this.playTone(320, 'sawtooth', 0.15, 0.25);
        this.playTone(210, 'sine', 0.25, 0.3, 0.05);
    }

    playShieldBlock() {
        this.init();
        if (this.muted || !this.ctx) return;
        // Metallic clink
        this.playTone(1400, 'triangle', 0.3, 0.3);
        this.playTone(2100, 'sine', 0.25, 0.25, 0.02);
        this.playTone(3500, 'sine', 0.2, 0.15, 0.04);
    }

    playPotionHeal() {
        this.init();
        if (this.muted || !this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            this.playTone(freq, 'sine', 0.25, 0.2, i * 0.07);
        });
    }

    playPotionPower() {
        this.init();
        if (this.muted || !this.ctx) return;
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, i) => {
            this.playTone(freq, 'triangle', 0.22, 0.2, i * 0.06);
        });
    }

    playComboUp(streak = 1) {
        this.init();
        if (this.muted || !this.ctx) return;
        const baseFreq = Math.min(440 + streak * 70, 1100);
        this.playTone(baseFreq, 'sine', 0.15, 0.2);
        this.playTone(baseFreq * 1.25, 'sine', 0.2, 0.2, 0.05);
        this.playTone(baseFreq * 1.5, 'triangle', 0.25, 0.25, 0.1);
    }

    playRegroupChime() {
        this.init();
        if (this.muted || !this.ctx) return;
        this.playTone(880, 'sine', 0.12, 0.18);
        this.playTone(1174.66, 'sine', 0.18, 0.2, 0.06);
    }

    playVictoryFanfare() {
        this.init();
        if (this.muted || !this.ctx) return;
        // Royal fanfare: C4, G4, C5, E5, G5
        const fanfare = [
            { f: 523.25, d: 0.15, t: 0 },
            { f: 523.25, d: 0.15, t: 0.15 },
            { f: 523.25, d: 0.15, t: 0.3 },
            { f: 659.25, d: 0.45, t: 0.48 },
            { f: 587.33, d: 0.15, t: 0.95 },
            { f: 659.25, d: 0.15, t: 1.1 },
            { f: 783.99, d: 0.6, t: 1.25 }
        ];
        fanfare.forEach(note => {
            this.playTone(note.f, 'triangle', note.d, 0.3, note.t);
            this.playTone(note.f * 1.005, 'sine', note.d, 0.2, note.t);
        });
    }

    playDefeatSound() {
        this.init();
        if (this.muted || !this.ctx) return;
        const notes = [440, 415.30, 392, 349.23];
        notes.forEach((freq, i) => {
            this.playTone(freq, 'sawtooth', 0.35, 0.2, i * 0.22);
        });
    }

    playButtonClick() {
        this.init();
        if (this.muted || !this.ctx) return;
        this.playTone(700, 'sine', 0.06, 0.15);
    }

    playKeypadTap(num) {
        this.init();
        if (this.muted || !this.ctx) return;
        const freq = 500 + (parseInt(num, 10) || 0) * 45;
        this.playTone(freq, 'triangle', 0.08, 0.12);
    }

    playChestOpen() {
        this.init();
        if (this.muted || !this.ctx) return;
        this.playTone(300, 'square', 0.15, 0.15);
        this.playTone(600, 'sine', 0.2, 0.2, 0.1);
        this.playTone(900, 'triangle', 0.3, 0.25, 0.2);
        this.playTone(1200, 'sine', 0.4, 0.3, 0.3);
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}

window.soundFX = new SoundFX();
