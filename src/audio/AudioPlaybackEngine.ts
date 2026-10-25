export class AudioPlaybackEngine {
  private context: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;

  private onEndedCallback: (() => void) | null = null;

  async play(
    buffer: AudioBuffer,
    onEnded?: () => void
  ): Promise<void> {
    this.stop();

    if (!this.context || this.context.state === "closed") {
      this.context = new AudioContext();
    }

    await this.context.resume();

    const source = this.context.createBufferSource();

    source.buffer = buffer;
    source.connect(this.context.destination);

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

  stop(): void {
    if (!this.source) return;

    const source = this.source;

    this.source = null;
    this.onEndedCallback = null;

    source.onended = null;
    source.stop();
    source.disconnect();
  }

  async cleanup(): Promise<void> {
    this.stop();

    if (this.context && this.context.state !== "closed") {
      await this.context.close();
    }

    this.context = null;
  }
}