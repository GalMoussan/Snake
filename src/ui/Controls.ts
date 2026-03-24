export class Controls {
  private startButton: HTMLButtonElement | null;
  private pauseButton: HTMLButtonElement | null;

  constructor(
    private onStart: () => void,
    private onPause: () => void
  ) {
    this.startButton = document.getElementById('startBtn') as HTMLButtonElement;
    this.pauseButton = document.getElementById('pauseBtn') as HTMLButtonElement;
    this.setupListeners();
  }

  private setupListeners(): void {
    this.startButton?.addEventListener('click', this.onStart);
    this.pauseButton?.addEventListener('click', this.onPause);
  }

  updateButtonStates(isPlaying: boolean, isPaused: boolean): void {
    if (this.startButton) {
      this.startButton.textContent = isPlaying ? 'Restart' : 'Start';
    }
    if (this.pauseButton) {
      this.pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
      this.pauseButton.disabled = !isPlaying && !isPaused;
    }
  }

  destroy(): void {
    this.startButton?.removeEventListener('click', this.onStart);
    this.pauseButton?.removeEventListener('click', this.onPause);
  }
}
