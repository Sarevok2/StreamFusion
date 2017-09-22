import {AudioService} from "./audio.service";

export interface AudioContainer {
    play(): void;
    setUrl(url: string): void;
    pause(): void;
    getDuration(): number;
    getCurrentTime(): Promise<number>;
    setPosition(currentPosition: number): void;
}

export class AudioContainerHTML implements AudioContainer {
    private audioElement: HTMLAudioElement;

    constructor (private audioService: AudioService) {
        this.audioElement = new Audio();

        this.audioElement.addEventListener("timeupdate", this.onTimeUpdate.bind(this));
        this.audioElement.addEventListener("ended", this.onEnded.bind(this));
        this.audioElement.addEventListener('loadeddata', this.onLoadedData.bind(this));
    }

    public play(): void {
        if (this.audioElement.readyState >= 2) {
            this.audioElement.play();
        }
    }

    public setUrl(url: string): void {
        this.audioElement.src = url;
        this.audioElement.load();
    }

    public pause(): void {
        this.audioElement.pause();
    }

    public getDuration(): number {
        return this.audioElement.duration;
    }

    public getCurrentTime(): Promise<number> {
        return new Promise((resolve, reject) => resolve(this.audioElement.currentTime));
    }

    public setPosition(currentPosition: number): void {
        this.audioElement.currentTime = this.audioElement.duration * currentPosition;
    }

    private onTimeUpdate(): void {
        this.audioService.onTimeUpdate();
    }

    private onEnded(): void {
        this.audioService.onEnded();
    }

    private onLoadedData(): void {
        this.audioService.onLoadedData();
    }
}

export class AudioContainerMedia implements AudioContainer {
    private media: Media;

    constructor (private audioService: AudioService) {}

    public play(): void {
        this.media.play();
    }

    public setUrl(url: string): void {
        this.media = new Media(url,
            () => this.onEnded,
            (err: MediaError) => console.log("playAudio():Audio Error: " + err.code),
            () => this.onTimeUpdate
        );
    }

    public pause(): void {
        this.media.pause();
    }

    public getDuration(): number {
        return this.media.getDuration();
    }

    public getCurrentTime(): Promise<number> {
        return new Promise((resolve, reject) => this.media.getCurrentPosition(resolve, reject));
    }

    public setPosition(currentPosition: number): void {

    }

    private onTimeUpdate(): void {
        this.audioService.onTimeUpdate();
    }

    private onEnded(): void {
        this.audioService.onEnded();
    }

    private onLoadedData(): void {
        this.audioService.onLoadedData();
    }
}
