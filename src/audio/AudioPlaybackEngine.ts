 export class AudioPlaybackEngine {
  private context: AudioContext | null = null;

  private source: AudioBufferSourceNode | null = null;

  private analyser: AnalyserNode | null = null;

  private frequencyData: Uint8Array<ArrayBuffer> | null = null;

  private onEndedCallback: (() => void) | null = null;

  // Initialize AudioContext and FFT analyser
  private initialize(): void {
    if (!this.context || this.context.state === "closed") {
      this.context = new AudioContext();

      this.analyser = this.context.createAnalyser();

      // FFT 512 -> 256 frequency bins
      this.analyser.fftSize = 512;

      this.analyser.smoothingTimeConstant = 0.8;

      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;

      this.frequencyData = new Uint8Array(
        this.analyser.frequencyBinCount
      );

      this.analyser.connect(this.context.destination);
    }
  }

  // Play decoded AudioBuffer
  async play(
    buffer: AudioBuffer,
    onEnded?: () => void
  ): Promise<void> {
    this.stop();

    this.initialize();

    if (!this.context || !this.analyser) {
      throw new Error("Audio engine initialization failed");
    }

    await this.context.resume();

    const source = this.context.createBufferSource();

    source.buffer = buffer;

    // Audio graph:
    // Source -> Analyser -> Speakers
    source.connect(this.analyser);

    this.source = source;
    this.onEndedCallback = onEnded ?? null;

    source.onended = () => {
      if (this.source !== source) return;

      source.disconnect();
      this.source = null;

      const callback = this.onEndedCallback;
      this.onEndedCallback = null;

      callback?.();
    };

    source.start(0);
  }

  // Return frequency data (0-255)
  getFrequencyData(): Uint8Array<ArrayBuffer> | null {
    if (!this.analyser || !this.frequencyData) {
      return null;
    }

    this.analyser.getByteFrequencyData(this.frequencyData);

    return this.frequencyData;
  }

  // Return number of FFT bins
  getFrequencyBinCount(): number {
    return this.analyser?.frequencyBinCount ?? 0;
  }

  // Check whether analyser is initialized
  hasAnalyser(): boolean {
    return this.analyser !== null;
  }

  // Stop playback
  stop(): void {
    if (!this.source) return;

    const source = this.source;

    this.source = null;
    this.onEndedCallback = null;

    source.onended = null;
    source.stop();
    source.disconnect();
  }

  // Release resources
  async cleanup(): Promise<void> {
    this.stop();

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.context && this.context.state !== "closed") {
      await this.context.close();
    }

    this.context = null;
    this.frequencyData = null;
  }
}