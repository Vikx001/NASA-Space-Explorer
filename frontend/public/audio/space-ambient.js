// Space Ambient Audio Generator
// This creates a synthetic space ambient sound using Web Audio API

class SpaceAmbientGenerator {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.oscillators = [];
    this.isPlaying = false;
  }

  async init() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.1; // Low volume for ambient
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }

  createSpaceAmbient() {
    if (!this.audioContext) return;

    // Clear existing oscillators
    this.stop();

    // Deep space rumble (very low frequency)
    const rumble = this.audioContext.createOscillator();
    rumble.type = 'sine';
    rumble.frequency.setValueAtTime(40, this.audioContext.currentTime);
    
    const rumbleGain = this.audioContext.createGain();
    rumbleGain.gain.value = 0.3;
    
    rumble.connect(rumbleGain);
    rumbleGain.connect(this.gainNode);

    // Cosmic wind (modulated mid-frequency)
    const wind = this.audioContext.createOscillator();
    wind.type = 'triangle';
    wind.frequency.setValueAtTime(120, this.audioContext.currentTime);
    
    const windGain = this.audioContext.createGain();
    windGain.gain.value = 0.15;
    
    // Add LFO for wind modulation
    const windLFO = this.audioContext.createOscillator();
    windLFO.type = 'sine';
    windLFO.frequency.setValueAtTime(0.3, this.audioContext.currentTime);
    
    const windLFOGain = this.audioContext.createGain();
    windLFOGain.gain.value = 20;
    
    windLFO.connect(windLFOGain);
    windLFOGain.connect(wind.frequency);
    
    wind.connect(windGain);
    windGain.connect(this.gainNode);

    // Stellar harmonics (higher frequencies)
    const harmonic1 = this.audioContext.createOscillator();
    harmonic1.type = 'sine';
    harmonic1.frequency.setValueAtTime(200, this.audioContext.currentTime);
    
    const harmonic1Gain = this.audioContext.createGain();
    harmonic1Gain.gain.value = 0.08;
    
    harmonic1.connect(harmonic1Gain);
    harmonic1Gain.connect(this.gainNode);

    const harmonic2 = this.audioContext.createOscillator();
    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(300, this.audioContext.currentTime);
    
    const harmonic2Gain = this.audioContext.createGain();
    harmonic2Gain.gain.value = 0.05;
    
    harmonic2.connect(harmonic2Gain);
    harmonic2Gain.connect(this.gainNode);

    // Store oscillators for cleanup
    this.oscillators = [rumble, wind, windLFO, harmonic1, harmonic2];

    return this.oscillators;
  }

  async play() {
    if (!this.audioContext) {
      const initialized = await this.init();
      if (!initialized) return false;
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.createSpaceAmbient();
    
    // Start all oscillators
    const currentTime = this.audioContext.currentTime;
    this.oscillators.forEach(osc => {
      osc.start(currentTime);
    });

    this.isPlaying = true;
    return true;
  }

  stop() {
    if (this.oscillators.length > 0) {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      this.oscillators = [];
    }
    this.isPlaying = false;
  }

  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume)) * 0.1;
    }
  }

  isActive() {
    return this.isPlaying;
  }
}

// Export for use in React components (only if not already defined)
if (!window.SpaceAmbientGenerator) {
  window.SpaceAmbientGenerator = SpaceAmbientGenerator;
}
