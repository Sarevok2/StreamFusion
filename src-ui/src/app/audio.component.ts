import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'audioPlayer',
    templateUrl: "./audio.component.html"
})
export class AudioComponent implements OnInit {
    @Output() onSongEnded: EventEmitter<void> = new EventEmitter<void>();
    private audioElement: any;

    ngOnInit() {
        this.audioElement = document.getElementById("audioPlayer");
    }

    public play(url: string): void {
        this.audioElement.src = url;
        this.audioElement.load();
        this.audioElement.play();
        this.audioElement.addEventListener("ended", () => this.onSongEnded.emit());
    }

    public stop(): void {
        this.audioElement.pause();
    }
}
