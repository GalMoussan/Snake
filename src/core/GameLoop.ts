export class GameLoop {
  private lastTimestamp: number = 0;
  private accumulatedTime: number = 0;
  private rafId: number = 0;
  private running: boolean = false;
  private currentTickInterval: number;

  constructor(
    tickInterval: number,
    private readonly onTick: () => void,
    private readonly onRender: () => void
  ) {
    this.currentTickInterval = tickInterval;
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.lastTimestamp = performance.now();
    this.accumulatedTime = 0;
    this.loop(this.lastTimestamp);
  }

  stop(): void {
    if (!this.running) {
      return;
    }

    this.running = false;
    if (this.rafId !== 0) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  setTickInterval(interval: number): void {
    this.currentTickInterval = interval;
  }

  private loop(timestamp: number): void {
    if (!this.running) {
      return;
    }

    // Calculate delta time
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Accumulate time for fixed timestep updates
    this.accumulatedTime += deltaTime;

    // Process ticks at fixed intervals
    while (this.accumulatedTime >= this.currentTickInterval) {
      this.onTick();
      this.accumulatedTime -= this.currentTickInterval;
    }

    // Render every frame
    this.onRender();

    // Schedule next frame
    this.rafId = requestAnimationFrame((ts) => this.loop(ts));
  }
}
