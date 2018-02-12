import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Song} from "../model/song";
import {AudioComponent} from "./audio.component";
import { AppConfig } from '../app.config';
import {AudioService} from "../service/audio.service";
import {ScrollbarComponent} from "./scrollbar.component";

const PLAY_TRACK_COMMAND: string = "playtrack?fullpath=";

@Component({
    selector: 'playlist',
    templateUrl: "playlist.component.html"
})
export class PlaylistComponent implements OnInit {
    public songs: Array<Song> = [];
    private currentIndex: number = 0;
    @Output() private onGoToBrowser = new EventEmitter();
    @ViewChild('playlistScrollbar') private playlistScrollbar: ScrollbarComponent;

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
        this.playlistScrollbar.updateSize();
    }

    public onPlaySong(index: number): void {
        this.currentIndex = index;
        this.playCurrentSong();
    }

    public onRemoveSong(index: number): void {
        this.songs.splice(index,1);
        this.playlistScrollbar.updateSize();
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
        this.playlistScrollbar.updateSize();
    }

    public goToBrowser(): void {
        this.onGoToBrowser.emit();
    }

    private playCurrentSong(): void {
        if (this.songs.length > 0) {
            const currentSong: Song = this.songs[this.currentIndex];
            const nextSong: Song = this.songs[(this.currentIndex + 1) % this.songs.length];
            const url: string = this.createPlayTrackURL(currentSong.path,currentSong.fileName);
            const nextUrl: string = this.appConfig.getApiEndpoint() + PLAY_TRACK_COMMAND + nextSong.path + "/" + nextSong.fileName;
            this.audioService.playSong(url, nextUrl);
        }
    }

    private createPlayTrackURL(path: string, fileName: string): string {
        return this.appConfig.getApiEndpoint() + PLAY_TRACK_COMMAND + encodeURIComponent(path) + "/" + encodeURIComponent(fileName);
    }
}
