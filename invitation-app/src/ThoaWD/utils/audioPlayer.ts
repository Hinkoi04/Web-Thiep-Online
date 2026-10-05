/**
 * Web Audio API based romantic ambient wedding music player
 * Produces soft, mellow acoustic piano & music box tones with reverb
 * Plays melody inspired by romantic wedding themes (Canon in D / Wedding Chimes)
 */

class RomanticWeddingAudio {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private currentStep = 0;
  private masterGain: GainNode | null = null;
  private onStateChange?: (playing: boolean) => void;

  // Notes frequencies (Hz) for romantic wedding melody in D Major
  private notes: { [key: string]: number } = {
    D3: 146.83,
    A3: 220.0,
    B3: 246.94,
    Fsharp3: 185.0,
    G3: 196.0,
    D4: 293.66,
    E4: 329.63,
    Fsharp4: 369.99,
    G4: 392.0,
    A4: 440.0,
    B4: 493.88,
    Csharp5: 554.37,
    D5: 587.33,
    E5: 659.25,
    Fsharp5: 739.99,
    REST: 0,
  };

  // Tender melody sequence (note, duration in beats)
  private melody: Array<{ note: string; bass?: string; duration: number }> = [
    { note: 'Fsharp5', bass: 'D3', duration: 1.5 },
    { note: 'E5', duration: 0.5 },
    { note: 'D5', bass: 'A3', duration: 1.5 },
    { note: 'Csharp5', duration: 0.5 },
    { note: 'B4', bass: 'B3', duration: 1.5 },
    { note: 'A4', duration: 0.5 },
    { note: 'B4', bass: 'Fsharp3', duration: 1.5 },
    { note: 'Csharp5', duration: 0.5 },
    { note: 'D5', bass: 'G3', duration: 1.5 },
    { note: 'Csharp5', duration: 0.5 },
    { note: 'B4', bass: 'D3', duration: 1.5 },
    { note: 'A4', duration: 0.5 },
    { note: 'G4', bass: 'G3', duration: 1.5 },
    { note: 'Fsharp4', duration: 0.5 },
    { note: 'E4', bass: 'A3', duration: 2.0 },

    // Phrase 2:
    { note: 'A4', bass: 'D3', duration: 1.0 },
    { note: 'Fsharp4', duration: 1.0 },
    { note: 'G4', bass: 'A3', duration: 1.0 },
    { note: 'E4', duration: 1.0 },
    { note: 'D4', bass: 'B3', duration: 1.0 },
    { note: 'Fsharp4', duration: 1.0 },
    { note: 'A4', bass: 'Fsharp3', duration: 2.0 },
    { note: 'G4', bass: 'G3', duration: 1.0 },
    { note: 'B4', duration: 1.0 },
    { note: 'A4', bass: 'D3', duration: 1.0 },
    { note: 'Fsharp4', duration: 1.0 },
    { note: 'E4', bass: 'A3', duration: 2.0 },
  ];

  public setCallback(cb: (playing: boolean) => void) {
    this.onStateChange = cb;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, duration: number, isBass = false) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm, soft acoustic sound (sine + gentle triangle harmonic)
    osc.type = isBass ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const noteDecay = isBass ? duration * 1.2 : duration * 1.5;
    const peakVolume = isBass ? 0.12 : 0.15;

    // Gentle attack and tender decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakVolume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDecay);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + noteDecay + 0.1);
  }

  private step() {
    if (!this.isPlaying || !this.ctx) return;

    const item = this.melody[this.currentStep];
    const freq = this.notes[item.note] || 0;
    const beatSec = 0.55; // tempo
    const durSec = item.duration * beatSec;

    if (freq > 0) {
      this.playTone(freq, durSec, false);
    }

    if (item.bass) {
      const bassFreq = this.notes[item.bass] || 0;
      if (bassFreq > 0) {
        this.playTone(bassFreq, durSec * 1.4, true);
      }
    }

    this.currentStep = (this.currentStep + 1) % this.melody.length;

    this.timer = window.setTimeout(() => {
      this.step();
    }, durSec * 1000);
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.onStateChange?.(true);
    this.step();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.onStateChange?.(false);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudio = new RomanticWeddingAudio();
