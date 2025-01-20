
export class HemiSync {
    constructor(baseFrequency, beatFrequency) {
      this.baseFrequency = baseFrequency;
      this.beatFrequency = beatFrequency;
      this.audioContext = new (window.AudioContext)();
      this.leftOscillator = null;
      this.rightOscillator = null;

      this.leftPanner = this.audioContext.createStereoPanner();
      this.rightPanner = this.audioContext.createStereoPanner();

      this.leftGain = this.audioContext.createGain();
      this.rightGain = this.audioContext.createGain();

      this.leftPanner.pan.value = -1; // Left channel
      this.rightPanner.pan.value = 1; // Right channel

      this.leftPanner.connect(this.leftGain);
      this.rightPanner.connect(this.rightGain);

      this.leftGain.connect(this.audioContext.destination);
      this.rightGain.connect(this.audioContext.destination);

      // Set default volume level (range: 0.0 to 1.0)
      this.leftGain.gain.value = 0.5;
      this.rightGain.gain.value = 0.5;
    }

    play() {
      this.leftOscillator = this.audioContext.createOscillator();
      this.rightOscillator = this.audioContext.createOscillator();

      this.leftOscillator.connect(this.leftPanner);
      this.rightOscillator.connect(this.rightPanner);

      this.leftOscillator.frequency.value = this.baseFrequency;
      this.rightOscillator.frequency.value =
        this.baseFrequency + this.beatFrequency;

      this.leftOscillator.start();
      this.rightOscillator.start();
    }

    stop() {
      this.leftOscillator.stop();
      this.rightOscillator.stop();
    }

    setBaseFrequency(frequency) {
      this.baseFrequency = frequency;
    }

    setBeatFrequency(frequency) {
      this.beatFrequency = frequency;
    }

    setVolume(volume) {
      // Clamp volume between 1 and 100
      const clampedVolume = Math.max(1, Math.min(100, volume));
      const step = 1;
      const value = Math.floor(clampedVolume / step) * step;
      this.leftGain.gain.value = value > 1 ? value / 100 : 0;
      this.rightGain.gain.value = value > 1 ? value / 100 : 0;
    }
  }

  let hemy = new HemiSync(200, 7);

//   function setBaseFrequency() {
//     const baseFrequency = document.getElementById("baseFrequency").value;
//     hemy.setBaseFrequency(baseFrequency);
//   }

//   function setBeatFrequency() {
//     const beatFrequency = document.getElementById("beatFrequency").value;
//     hemy.setBeatFrequency(beatFrequency);
//   }

  export const startBinauralBeat = () => {
    hemy.play();
  }

  export const stopBinauralBeat = () => {
    hemy.stop();
  }