class Sound{

    constructor(context) {

        this.audioContext = context;
        this.oscillator = this.audioContext.createOscillator();
        this.evo = this.audioContext.createGain();
        this.oscillator.connect(this.evo);
        this.evo.connect(this.audioContext.destination);

    }

    play() {

        this.oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.01);
        this.oscillator.frequency.setValueAtTime(1100, this.audioContext.currentTime);
        this.evo.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + 0.001);
        this.evo.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.01);
        this.oscillator.start(this.audioContext.currentTime);
        this.oscillator.stop(this.audioContext.currentTime + 0.1);
        boing = new Sound(context);
    }
}
