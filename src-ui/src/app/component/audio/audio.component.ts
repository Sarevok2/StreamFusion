import {Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {AudioService} from "../../service/audio.service";

@Component({
    selector: 'audio-player',
    templateUrl: 'audio.component.html',
    styleUrls: ['audio.component.css']
})
export class AudioComponent implements OnInit {
    public currentTime: string = "0.00";
    public duration: string = "0.00";
    public seekMarkerPos: string;

    @Output() public previousSong: EventEmitter<void> = new EventEmitter();
    @Output() public nextSong: EventEmitter<void> = new EventEmitter();

    private seekBarElement: HTMLDivElement;

    constructor(@Inject(AudioService) private audioService: AudioService) {}

    ngOnInit(): void {
        this.seekBarElement = <HTMLDivElement>document.getElementById("seek-bar");
        this.audioService.timeUpdateSubject.subscribe({
            next: (currentTime: number) => this.onTimeUpdate(currentTime)
        });
        this.audioService.songChangedSubject.subscribe({
            next: (v) => this.onSongChanged()
        });
    }

    public isPlaying(): boolean {
        return this.audioService.isPlaying;
    }

    public resume(): void {
        this.audioService.resume();
    }

    public stop(): void {
        this.audioService.stop();
    }

    public onPlayPause(): void {
        if (this.audioService.isPlaying) {
            this.stop();
        } else {
            this.resume();
        }
    }

    public onPreviousSong(): void {
        this.previousSong.emit();
    }

    public onNextSong(): void {
        this.nextSong.emit();
    }

    public onSeekBarClick(event: MouseEvent): void {
        let newPosition: number = (event.offsetX / this.seekBarElement.offsetWidth);
        this.seekMarkerPos = (newPosition * 100) + "%";
        this.audioService.setPosition(newPosition);
    }

    private onSongChanged(): void {
        let duration: number = this.audioService.getDuration();
        if (!isNaN(duration)) {
            this.duration = this.formatTime(this.audioService.getDuration());
        }
    }

    private onTimeUpdate(currentTime: number): void {
        let percentComplete: number = currentTime / this.audioService.getDuration() * 100;
        this.seekMarkerPos = percentComplete + "%";

        if (!isNaN(currentTime)) {
            this.currentTime = this.formatTime(currentTime);
        }
    }

    private formatTime(seconds: number): string {
        let dateString: string = new Date(seconds * 1000).toISOString();

        let offset: number = 4;
        if (seconds >= 600 && seconds < 3600) {
            offset = 3;
        } else if (seconds >= 3600) {
            offset = 1;
        }

        return dateString.substr(11 + offset, 8 - offset);
    }
}
