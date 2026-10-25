 export class AudioPlaybackEngine {
  private context: AudioContext | null = null;

  private source: AudioBufferSourceNode | null = null;

  private analyser: AnalyserNode | null = null;

  private frequencyData: Uint8Array<ArrayBuffer> | null = null;

  private onEndedCallback: (() => void) | null = null;

  // M4A - Track the latest playback request
  private requestId = 0;

  private initialize(): void {
    if (!this.context || this.context.state === "closed") {
      this.context = new AudioContext();

      this.analyser = this.context.createAnalyser();

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

  async play(
    buffer: AudioBuffer,
    onEnded?: () => void
  ): Promise<boolean> {

    // Stop previous playback and invalidate old requests
    this.stop();

    // Capture the current request
    const currentRequest = this.requestId;

    this.initialize();

    if (!this.context || !this.analyser) {
      throw new Error("Audio engine initialization failed");
    }

    const context = this.context;
    const analyser = this.analyser;

    await context.resume();

    // M4A - Ignore outdated playback requests
    if (
      currentRequest !== this.requestId ||
      context.state === "closed"
    ) {
      console.log("Stale playback request ignored");
      return false;
    }

    const source = context.createBufferSource();

    source.buffer = buffer;
    source.connect(analyser);

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

    return true;
  }

  getFrequencyData(): Uint8Array<ArrayBuffer> | null {
    if (!this.analyser || !this.frequencyData) {
      return null;
    }

    this.analyser.getByteFrequencyData(this.frequencyData);

    return this.frequencyData;
  }

  getFrequencyBinCount(): number {
    return this.analyser?.frequencyBinCount ?? 0;
  }

  hasAnalyser(): boolean {
    return this.analyser !== null;
  }

  stop(): void {

    // Invalidate all previous playback requests
    this.requestId++;

    if (!this.source) return;

    const source = this.source;

    this.source = null;
    this.onEndedCallback = null;

    source.onended = null;

    try {
      source.stop();
    } catch (error) {
      console.warn("Audio source already stopped:", error);
    }

    source.disconnect();
  }

  async cleanup(): Promise<void> {
  // Invalidate pending playback requests
  this.stop();

  // Disconnect FFT analyser
  if (this.analyser) {
    this.analyser.disconnect();
    this.analyser = null;
  }

  // Release frequency array reference
  this.frequencyData = null;

  // Capture current context
  const context = this.context;

  this.context = null;

  // Close AudioContext
  if (context && context.state !== "closed") {
    try {
      await context.close();
    } catch (error) {
      console.warn("AudioContext cleanup failed:", error);
    }
  }

  console.log("Audio playback resources cleaned up");
}
}