export class CanvasVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private animationId: number | null = null;
  private isRunning = false;

  private readonly barCount = 64;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas 2D is not supported");
    }

    this.ctx = context;

    this.resize();
  }

  // Adjust canvas resolution for high-DPI screens
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Render frequency bars
  render(frequencyData: Uint8Array): void {
    const ctx = this.ctx;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    if (width <= 0 || height <= 0) return;

    const gap = 3;

    const barWidth =
      (width - gap * (this.barCount - 1)) /
      this.barCount;

    const binsPerBar = Math.max(
      1,
      Math.floor(frequencyData.length / this.barCount)
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

      const hue = 190 + (i / this.barCount) * 80;

      ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;

      ctx.fillRect(
        x,
        y,
        barWidth,
        barHeight
      );
    }
  }

  // Start animation loop
  start(
    getFrequencyData: () => Uint8Array | null
  ): void {
    this.stop();

    this.isRunning = true;

    const animate = () => {
      if (!this.isRunning) return;

      const data = getFrequencyData();

      if (data) {
        this.render(data);
      }

      this.animationId =
        requestAnimationFrame(animate);
    };

    animate();
  }

  // Stop animation
  stop(): void {
    this.isRunning = false;

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // Clear canvas
  clear(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.ctx.clearRect(0, 0, width, height);
  }

  // Release animation resources
  cleanup(): void {
    this.stop();
    this.clear();
  }
}