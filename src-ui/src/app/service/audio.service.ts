import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from 'rxjs';
import {AudioContainer, AudioContainerHTML, AudioContainerMedia} from "./audio.container";

@Injectable()
export class AudioService {
    public timeUpdateSubject: BehaviorSubject<number>;
    public songEndedSubject: BehaviorSubject<void>;
    public songChangedSubject: Subject<void>;
    public isPlaying: boolean = false;

    private audioContainer: AudioContainer;
    private audioContainer2: AudioContainer;
    private preLoaded: boolean = false;
    private isCordova: boolean = !!window["cordova"];
    private nextUrl: string;
    private wind: any = window;

    constructor() {
        this.audioContainer = new AudioContainerHTML(this);
        this.audioContainer2 = new AudioContainerHTML(this);
        this.timeUpdateSubject = new BehaviorSubject(0);
        this.songEndedSubject = new BehaviorSubject(null);
        this.songChangedSubject = new BehaviorSubject(null);
    }

    public onTimeUpdate(): void {
        this.audioContainer.getCurrentTime().then((currentTime: number) => {
            if (!this.preLoaded && (currentTime / this.audioContainer.getDuration()) > 0.95 && this.nextUrl && this.nextUrl.length > 0) {
                this.audioContainer2.setUrl(this.nextUrl);
                this.preLoaded = true;
            }
            this.timeUpdateSubject.next(currentTime);
        });
    }

    public onEnded(): void {
        this.songEndedSubject.next(null);
    }

    public onLoadedData(): void {
        if (!this.isPlaying) {
            this.resume();
            this.songChangedSubject.next(null);
        }
    }

    public getDuration(): number {
        return this.audioContainer.getDuration();
    }

    public playSong(url: string, nextUrl?: string): void {
        this.isPlaying = false;
        if (this.preLoaded && url === this.nextUrl) {
            this.audioContainer.pause();
            let tempAudio: AudioContainer = this.audioContainer;
            this.audioContainer = this.audioContainer2;
            this.audioContainer2 = tempAudio;
            this.audioContainer.play();
            this.songChangedSubject.next(null);
            // TODO: may still be in the process of loading
        } else {
            this.audioContainer.setUrl(url);
        }
        this.nextUrl = nextUrl;
        this.preLoaded = false;
    }

    public resume(): void {
        if (!this.isPlaying && this.isCordova) {
            this.wind.cordova.plugins.backgroundMode.enable();
        }
        this.audioContainer.play();
        this.isPlaying = true;
    }

    public stop(): void {
        this.audioContainer.pause();
        this.isPlaying = false;
        if (this.isCordova) {
            this.wind.cordova.plugins.backgroundMode.disable();
        }
    }

    public setPosition(newPosition: number): void {
        this.audioContainer.setPosition(newPosition);
    }

    public setVolume(volume: number): void {
        this.audioContainer.setVolume(volume);
    }
}


