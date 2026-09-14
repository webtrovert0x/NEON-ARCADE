// Procedural Web Audio Synthesizer for Cyberpunk UI & Game SFX

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function playTone(freq: number, type: OscillatorType = 'sine', duration = 0.12, volume = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio tone error:', e);
  }
}

export function playSound(type: 'click' | 'higher' | 'lower' | 'hint' | 'win' | 'fail' | 'flip' | 'unlock', soundEnabled = true) {
  if (!soundEnabled) return;
  switch (type) {
    case 'click':
      playTone(850, 'triangle', 0.05, 0.08);
      break;
    case 'higher':
      playTone(340, 'sine', 0.1, 0.12);
      setTimeout(() => playTone(510, 'sine', 0.14, 0.18), 75);
      break;
    case 'lower':
      playTone(510, 'sine', 0.1, 0.12);
      setTimeout(() => playTone(320, 'sine', 0.16, 0.18), 75);
      break;
    case 'hint':
      playTone(620, 'sine', 0.08, 0.1);
      setTimeout(() => playTone(930, 'sine', 0.12, 0.14), 85);
      break;
    case 'win':
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'sawtooth', 0.28, 0.16), i * 100);
      });
      break;
    case 'fail':
      playTone(200, 'sawtooth', 0.2, 0.18);
      setTimeout(() => playTone(130, 'sawtooth', 0.3, 0.22), 160);
      break;
    case 'flip':
      [400, 600, 800, 1000].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'triangle', 0.04, 0.06), i * 45);
      });
      break;
    case 'unlock':
      playTone(440, 'sine', 0.08, 0.1);
      setTimeout(() => playTone(880, 'sine', 0.15, 0.18), 90);
      break;
  }
}
