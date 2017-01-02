import {Component, ViewChild, Inject} from '@angular/core';
import {Song} from "./model/song";
import {AudioComponent} from "./audio.component";
import { AppConfig } from './app.config';

const PLAY_TRACK_COMMAND: string = "playtrack?fullpath=";

@Component({
    selector: 'playlist',
    templateUrl: "./playlist.component.html"
})
export class PlaylistComponent {
    private songs: Array<Song> = [];
    private expanded: boolean = true;
    private currentIndex: number = 0;
    @ViewChild(AudioComponent)
    private audio: AudioComponent;

    constructor (private appConfig: AppConfig) {}

    public addSongs(params: any) {
        if (params.play) {
            this.currentIndex = 0;
            this.songs = params.songs;
            this.playCurrentSong();
        } else {
            this.songs = this.songs.concat(params.songs);
        }
    }

    public toggleExpanded(): void {
        this.expanded = !this.expanded;
    }

    public onPlaySong(index: number): void {
        this.currentIndex = index;
        this.playCurrentSong();
    }

    public onRemoveSong(index: number): void {
        this.songs.splice(index,1);
    }

    public nextSong(): void {
        this.currentIndex = (this.currentIndex + 1) % this.songs.length;
        this.playCurrentSong();
    }

    public previous(): void {
        this.currentIndex = (this.currentIndex==0) ? (this.songs.length-1) : ((this.currentIndex - 1) % this.songs.length);
        this.playCurrentSong();
    }

    public onSongEnded(): void {
        this.nextSong();
    }

    public clear(): void {
        this.songs = [];
        this.currentIndex = 0;
        this.audio.stop();
    }

    private playCurrentSong(): void {
        const currentSong: Song = this.songs[this.currentIndex];
        const url = this.appConfig.getApiEndpoint() + PLAY_TRACK_COMMAND + currentSong.path + "/" + currentSong.name;
        this.audio.play(url);
    }
}
