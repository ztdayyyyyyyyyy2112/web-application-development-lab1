export class CanvasVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private animationId: number | null = null;
  private isRunning = false;

  private readonly barCount = 64;
  private readonly targetFrameTime = 1000 / 60;

  private lastFrameTime = 0;

  private getFrequencyData:
    (() => Uint8Array | null) | null = null;

  private resizeObserver: ResizeObserver;

  private width = 0;
  private height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas 2D is not supported");
    }

    this.ctx = context;

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    this.resizeObserver.observe(canvas);

    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );

    this.resize();
  }

  // Resize canvas for HiDPI displays
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    this.width = rect.width;
    this.height = rect.height;

    const pixelWidth = Math.max(
      1,
      Math.round(this.width * dpr)
    );

    const pixelHeight = Math.max(
      1,
      Math.round(this.height * dpr)
    );

    if (
      this.canvas.width !== pixelWidth ||
      this.canvas.height !== pixelHeight
    ) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
    }

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Render 64 frequency bars
  render(frequencyData: Uint8Array): void {
    const ctx = this.ctx;

    const width = this.width;
    const height = this.height;

    if (width <= 0 || height <= 0) return;

    ctx.clearRect(0, 0, width, height);

    const gap = 3;

    const barWidth = Math.max(
      1,
      (width - gap * (this.barCount - 1)) /
        this.barCount
    );

    const binsPerBar = Math.max(
      1,
      Math.floor(
        frequencyData.length / this.barCount
      )
    );

    for (let i = 0; i < this.barCount; i++) {
      let sum = 0;

      for (let j = 0; j < binsPerBar; j++) {
        const index = i * binsPerBar + j;

        sum += frequencyData[index] ?? 0;
      }

      const average = sum / binsPerBar;

      const normalized = average / 255;

      const barHeight = Math.max(
        2,
        normalized * height
      );

      const x = i * (barWidth + gap);
      const y = height - barHeight;

      const hue =
        190 + (i / this.barCount) * 80;

      ctx.fillStyle =
        `hsl(${hue}, 85%, 55%)`;

      ctx.fillRect(
        x,
        y,
        barWidth,
        barHeight
      );
    }
  }

  // Main animation loop
  private animate = (timestamp: number): void => {
    if (!this.isRunning) return;

    if (document.hidden) {
      this.animationId = null;
      return;
    }

    const elapsed = timestamp - this.lastFrameTime;

    if (elapsed >= this.targetFrameTime) {
      this.lastFrameTime =
        timestamp - (elapsed % this.targetFrameTime);

      const data = this.getFrequencyData?.();

      if (data) {
        this.render(data);
      }
    }

    this.animationId =
      requestAnimationFrame(this.animate);
  };

  // Start visualizer
  start(
    getFrequencyData: () => Uint8Array | null
  ): void {
    this.stop();

    this.getFrequencyData = getFrequencyData;
    this.isRunning = true;

    this.lastFrameTime = 0;

    if (!document.hidden) {
      this.animationId =
        requestAnimationFrame(this.animate);
    }
  }

  // Stop visualizer
  stop(): void {
    this.isRunning = false;

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.getFrequencyData = null;
  }

  // Clear canvas
  clear(): void {
    this.ctx.clearRect(
      0,
      0,
      this.width,
      this.height
    );
  }

  // Handle tab visibility
  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      return;
    }

    if (
      this.isRunning &&
      this.animationId === null
    ) {
      this.lastFrameTime = 0;

      this.animationId =
        requestAnimationFrame(this.animate);
    }
  };

  // Cleanup
  cleanup(): void {
    this.stop();

    this.resizeObserver.disconnect();

    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );

    this.clear();
  }
}