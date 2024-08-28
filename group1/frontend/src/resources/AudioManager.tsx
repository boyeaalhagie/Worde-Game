/**
 * The AudioManager class is responsible for playing sound effects.
 */
export class AudioManager {
    private static instance: AudioManager;
    private audioContext: AudioContext;
    private wrongLetterSound?: AudioBuffer;
    private rightLetterSound?: AudioBuffer;
    private victorySound?: AudioBuffer;
    private lossSound?: AudioBuffer;

    private constructor() {
        this.audioContext = new AudioContext();

        this.loadAudio(require('./click.wav')).then(buffer => {
            this.wrongLetterSound = buffer;
        });

        this.loadAudio(require('./Correct.wav')).then(buffer => {
            this.rightLetterSound = buffer;
        });

        this.loadAudio(require('./winningSound.wav')).then(buffer => {
            this.victorySound = buffer;
        });

        this.loadAudio(require('./sadTrombone.wav')).then(buffer => {
            this.lossSound = buffer;
        });
    }

    private async loadAudio(url: string): Promise<AudioBuffer> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    /**
     * Returns the instance of the AudioManager.
     */
    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }

        return AudioManager.instance;
    }

    /**
     * Plays the sound for a wrong letter.
     */
    public playWrongLetterSound(): void {
        this.playSound(this.wrongLetterSound);
    }

    /**
     * Plays the sound for a right letter.
     */
    public playRightLetterSound(): void {
        this.playSound(this.rightLetterSound);
    }

    /**
     * Plays the sound for a victory.
     */
    public playVictorySound(): void {
        this.playSound(this.victorySound);
    }

    public playLossSound(): void {
        this.playSound(this.lossSound);
    }

    /**
     * Plays the sound for a given audio buffer.
     * @param audioBuffer the sound effect to play
     * @private
     */
    private playSound(audioBuffer: AudioBuffer | undefined): void {
        const source = this.audioContext.createBufferSource();
        if (audioBuffer) {
            source.buffer = audioBuffer;
        }
        source.connect(this.audioContext.destination);
        source.start();
    }
}