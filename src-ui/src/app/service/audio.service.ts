import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {AudioContainer, AudioContainerHTML, AudioContainerMedia} from "./audio.container";
import {Subject} from "rxjs/Subject";

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
        if (!this.isCordova) {
            this.audioContainer = new AudioContainerHTML(this);
            this.audioContainer2 = new AudioContainerHTML(this);
        } else {
            this.audioContainer = new AudioContainerMedia(this);
            this.audioContainer2 = new AudioContainerMedia(this);
        }
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
            //TODO: This won't fire on Cordova
            this.songChangedSubject.next(null);
        }
    }

    public getDuration(): number {
        return this.audioContainer.getDuration();
    }

    public playSong(url: string, nextUrl?: string): void {
        this.isPlaying = false;
        if (this.preLoaded && url == this.nextUrl) {
            this.audioContainer.pause();
            let tempAudio: AudioContainer = this.audioContainer;
            this.audioContainer = this.audioContainer2;
            this.audioContainer2 = tempAudio;
            this.audioContainer.play();
            this.songChangedSubject.next(null);
            //TODO: may still be in the process of loading
        } else {
            this.audioContainer.setUrl(url);
        }
        this.nextUrl = nextUrl;
        this.preLoaded = false;
    }

    public resume(): void {
        if (this.isCordova) {
            if (!this.isPlaying && this.isCordova) {
                this.wind.powerManagement.dim(function () {
                    console.log('Wakelock acquired');
                }, function () {
                    console.log('Failed to acquire wakelock');
                });
            }
        }
        this.audioContainer.play();
        this.isPlaying = true;
    }

    public stop(): void {
        this.audioContainer.pause();
        this.isPlaying = false;
        if (this.isCordova) {
            this.wind.powerManagement.release(function () {
                console.log('Wakelock released');
            }, function () {
                console.log('Failed to release wakelock');
            });
        }
    }

    public setPosition(newPosition: number): void {
        this.audioContainer.setPosition(newPosition);
    }
}


