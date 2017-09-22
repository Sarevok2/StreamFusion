import {Component, Input, OnInit} from '@angular/core';
import {Song} from "../model/song";
import {AudioComponent} from "./audio.component";
import { AppConfig } from '../app.config';
import {AudioService} from "../service/audio.service";

const PLAY_TRACK_COMMAND: string = "playtrack?fullpath=";

@Component({
    selector: 'playlist',
    templateUrl: "playlist.component.html"
})
export class PlaylistComponent implements OnInit {
    public expanded: boolean = true;
    private songs: Array<Song> = [];
    private currentIndex: number = 0;

    constructor (private appConfig: AppConfig, private audioService: AudioService) {}

    ngOnInit(): void {
        this.audioService.songEndedSubject.subscribe({
            next: () => this.nextSong()
        });
    }

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

    public previousSong(): void {
        this.currentIndex = (this.currentIndex==0) ? (this.songs.length-1) : ((this.currentIndex - 1) % this.songs.length);
        this.playCurrentSong();
    }

    public clear(): void {
        this.songs = [];
        this.currentIndex = 0;
        this.audioService.stop();
    }

    private playCurrentSong(): void {
        if (this.songs.length > 0) {
            const currentSong: Song = this.songs[this.currentIndex];
            const nextSong: Song = this.songs[(this.currentIndex + 1) % this.songs.length];
            const url: string = this.appConfig.getApiEndpoint() + PLAY_TRACK_COMMAND + currentSong.path + "/" + currentSong.fileName;
            const nextUrl: string = this.appConfig.getApiEndpoint() + PLAY_TRACK_COMMAND + nextSong.path + "/" + nextSong.fileName;
            this.audioService.playSong(url, nextUrl);
        }
    }
}
