import {Component, OnInit, Input} from '@angular/core';
import {PlaylistComponent} from "./playlist.component";

const PLAY_IMAGE: string = "assets/svg/play.svg";
const PAUSE_IMAGE: string = "assets/svg/pause.svg";

@Component({
    selector: 'audioPlayer',
    templateUrl: "audio.component.html"
})
export class AudioComponent implements OnInit {
    public currentTime: string = "0.00";
    public duration: string = "0.00";
    public seekMarkerPos: string;
    public playPauseImage: string = PLAY_IMAGE;

    private audioElement: HTMLAudioElement;
    private audioElement2: HTMLAudioElement;
    private seekBarElement: HTMLDivElement;
    private isPlaying: boolean = false;
    private nextUrl: string;
    private preLoaded: boolean = false;
    private wind: any = window;
    @Input() private playlist: PlaylistComponent;

    ngOnInit() {
        this.seekBarElement = <HTMLDivElement>document.getElementById("seek-bar");

        this.audioElement = new Audio();
        this.audioElement2 = new Audio();

        this.audioElement.addEventListener("timeupdate", this.timeUpdate.bind(this));
        this.audioElement.addEventListener("ended", this.playlist.nextSong.bind(this.playlist));
        this.audioElement.addEventListener('loadeddata', this.onLoadedData.bind(this));
        this.audioElement2.addEventListener("timeupdate", this.timeUpdate.bind(this));
        this.audioElement2.addEventListener("ended", this.playlist.nextSong.bind(this.playlist));
        this.audioElement2.addEventListener('loadeddata', this.onLoadedData.bind(this));
    }

    public play(url: string, nextUrl?: string): void {
        this.isPlaying = false;
        if (this.preLoaded && url == this.nextUrl) {
            this.audioElement.pause();
            let tempAudio: HTMLAudioElement = this.audioElement;
            this.audioElement = this.audioElement2;
            this.audioElement2 = tempAudio;
            this.startNewSong();
            //TODO: may still be in the process of loading
        } else {
            this.audioElement.src = url;
            this.audioElement.load();
        }
        this.nextUrl = nextUrl;
        this.preLoaded = false;
    }

    public resume(): void {
        if (this.audioElement.readyState >= 2) {
            this.audioElement.play();
            this.playPauseImage = PAUSE_IMAGE;
            if (!this.isPlaying && !!window["cordova"]) {
                this.wind.powerManagement.dim(function () {
                    console.log('Wakelock acquired');
                }, function () {
                    console.log('Failed to acquire wakelock');
                });
            }
            this.isPlaying = true
        }
    }

    public stop(): void {
        this.audioElement.pause();
        this.playPauseImage = PLAY_IMAGE;
        this.isPlaying = false;
        if (!!window["cordova"]) {
            this.wind.powerManagement.release(function () {
                console.log('Wakelock released');
            }, function () {
                console.log('Failed to release wakelock');
            });
        }
    }

    public onPlayPause(): void {
        if (this.isPlaying) {
          this.stop();
        } else {
          this.resume();
        }
    }

    public onPreviousSong(): void {
        this.playlist.previousSong();
    }

    public onNextSong(): void {
        this.playlist.nextSong();
    }

    public onSeekBarClick(event: MouseEvent): void {
        let newPosition: number = (event.offsetX / this.seekBarElement.offsetWidth);
        this.seekMarkerPos = (newPosition*100) + "%";
        this.audioElement.currentTime = this.audioElement.duration * newPosition;
    }

    private startNewSong(): void {
        if (!isNaN(this.audioElement.duration)) {
            this.duration = this.formatTime(this.audioElement.duration);
        }
        this.resume();

    }

    private onLoadedData(): void {
        if (!this.isPlaying) {
            this.startNewSong();
        }
    }

    private timeUpdate(): void {
        let percentComplete: number = (100 * (this.audioElement.currentTime / this.audioElement.duration));
        this.seekMarkerPos = percentComplete + "%";

        if (!isNaN(this.audioElement.currentTime)) {
            this.currentTime = this.formatTime(this.audioElement.currentTime);
        }

        if (!this.preLoaded && percentComplete > 95 && this.nextUrl && this.nextUrl.length > 0) {
            this.audioElement2.src = this.nextUrl;
            this.audioElement2.load();
            this.preLoaded = true;
        }
    }

    private drawTimeRanges(): void {
        let timeRanges: any = this.audioElement.buffered;
        for (let timeRange of timeRanges) {

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
