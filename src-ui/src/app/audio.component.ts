import {Component, OnInit, Output, EventEmitter} from '@angular/core';

const PLAY_IMAGE: string = "assets/svg/play.svg";
const PAUSE_IMAGE: string = "assets/svg/pause.svg";

@Component({
    selector: 'audioPlayer',
    templateUrl: "./audio.component.html"
})
export class AudioComponent implements OnInit {
    @Output() onSongEnded: EventEmitter<void> = new EventEmitter<void>();
    private audioElement: any;
    private seekBarElement: any;
    private isPlaying: boolean = false;
    private playPauseImage: string = PLAY_IMAGE;
    private currentTime: string = "0.00";
    private duration: string = "0.00";
    private seekMarkerPos: string;

    ngOnInit() {
        this.audioElement = document.getElementById("audio-player");
        this.seekBarElement = document.getElementById("seek-bar");

        this.audioElement.addEventListener("timeupdate", () => this.timeUpdate(), false);
    }

    public play(url: string): void {
        this.audioElement.src = url;
        this.audioElement.load();
        this.audioElement.addEventListener('loadeddata', () => {
          this.duration = this.formatTime(this.audioElement.duration);
          this.resume();
        });
    }

    public resume(): void {
      if (this.audioElement.readyState >= 2) {
        this.audioElement.play();
        this.audioElement.addEventListener("ended", () => this.onSongEnded.emit());
        this.playPauseImage = PAUSE_IMAGE;
        this.isPlaying = true;
      }
    }

    public stop(): void {
        this.audioElement.pause();
        this.playPauseImage = PLAY_IMAGE;
        this.isPlaying = false;
    }

    public onPlayPause(): void {
        if (this.isPlaying) {
          this.stop();
        } else {
          this.resume();
        }
    }

    public onSeekBarClick(event: MouseEvent) {
        let newPosition: number = (event.offsetX / this.seekBarElement.offsetWidth);
        this.seekMarkerPos = (newPosition*100) + "%";
        this.audioElement.currentTime = this.audioElement.duration * newPosition;
    }

    private timeUpdate(): void {
      this.seekMarkerPos = (100 * (this.audioElement.currentTime / this.audioElement.duration)) + "%";
      let currentSeconds: any = this.audioElement.currentTime;
      if (!isNaN(currentSeconds)) {
        this.currentTime = this.formatTime(currentSeconds);
      }
    }

    private formatTime(seconds: number): string {
        let dateString: string = new Date(seconds * 1000).toISOString();

        let offset: number = 4;
        if (seconds >= 600 && seconds < 3600) {offset = 3;}
        else if (seconds >= 3600) {offset = 1;}

        return dateString.substr(11 + offset, 8 - offset);
    }
}
