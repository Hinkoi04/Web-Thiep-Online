const bgMusicUrl = '/thoahai/NhacNen.mp3';

class WeddingAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private wasPlayingBeforeHidden = false;
  private onStateChange?: (playing: boolean) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audio = new Audio(bgMusicUrl);
        this.audio.loop = true;
        this.audio.preload = 'auto';

        this.audio.addEventListener('play', () => {
          this.isPlaying = true;
          this.onStateChange?.(true);
        });
        this.audio.addEventListener('pause', () => {
          this.isPlaying = false;
          this.onStateChange?.(false);
        });
        this.audio.addEventListener('ended', () => {
          this.isPlaying = false;
          this.onStateChange?.(false);
        });

        // Tự động tạm dừng khi rời khỏi tab thiệp và tự động phát tiếp khi quay trở lại
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            if (this.isPlaying) {
              this.wasPlayingBeforeHidden = true;
              if (this.audio) {
                try {
                  this.audio.pause();
                } catch (e) {
                  console.warn('Pause on tab hide error:', e);
                }
              }
            }
          } else {
            if (this.wasPlayingBeforeHidden) {
              this.wasPlayingBeforeHidden = false;
              this.play();
            }
          }
        });
      } catch (e) {
        console.warn('Init audio error:', e);
      }
    }
  }

  public setCallback(cb: (playing: boolean) => void) {
    this.onStateChange = cb;
  }

  public play() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio(bgMusicUrl);
      this.audio.loop = true;
      this.audio.preload = 'auto';
    }
    if (!this.audio) return;

    try {
      const promise = this.audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            this.isPlaying = true;
            this.onStateChange?.(true);
          })
          .catch((err) => {
            console.warn('Audio auto-play error or blocked:', err);
            this.isPlaying = false;
            this.onStateChange?.(false);
          });
      } else {
        this.isPlaying = true;
        this.onStateChange?.(true);
      }
    } catch (e) {
      console.warn('Play audio failed:', e);
      this.isPlaying = false;
      this.onStateChange?.(false);
    }
  }

  public pause() {
    this.wasPlayingBeforeHidden = false;
    if (this.audio) {
      try {
        this.audio.pause();
      } catch (e) {
        console.warn('Pause audio error:', e);
      }
    }
    this.isPlaying = false;
    this.onStateChange?.(false);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.wasPlayingBeforeHidden = false;
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudio = new WeddingAudioPlayer();
