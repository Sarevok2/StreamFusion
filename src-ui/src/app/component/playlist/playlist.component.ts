import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {Song} from "app/model/song";
import {AudioComponent} from "../audio/audio.component";
import { AppConfig } from '../../app.config';
import {AudioService} from "app/service/audio.service";
import {Observable} from "rxjs";

const PLAY_TRACK_COMMAND: string = "playtrack?fullpath=";

@Component({
    selector: 'playlist',
    templateUrl: "playlist.component.html"
})
export class PlaylistComponent implements OnInit {
    public songs: Array<Song> = [];
    public shuffle: boolean = false;
    private currentIndex: number = 0;
    private songHistory: Array<number> = [];
    @Output() private onGoToBrowser = new EventEmitter();

    @ViewChild('scrollPanel') private scrollPanel: ElementRef;

    constructor (private appConfig: AppConfig, private audioService: AudioService) {}

    ngOnInit(): void {
        this.audioService.songEndedSubject.subscribe({
            next: () => this.nextSong()
        });
    }

    public addSongs(params: any) {
        let newSongs: Array<Song> = this.copySongArray(params.songs);
        if (params.play) {
            this.currentIndex = 0;
            this.songs = [];
            this.insertSongs(newSongs, 0);
            this.songHistory = [];
            this.playCurrentSong();
        } else {
            this.insertSongs(newSongs, this.songs.length);
        }
    }

    public onPlaySong(index: number): void {
        this.currentIndex = index;
        this.playCurrentSong();
    }

    public onRemoveSong(index: number): void {
        this.songs[index].isZeroHeight = true;
        const transitionEndFn = () => {
            this.songs.splice(index, 1);
            this.songHistory = [];
            this.scrollPanel.nativeElement.removeEventListener('transitionend', transitionEndFn);
        };
        this.scrollPanel.nativeElement.addEventListener('transitionend', transitionEndFn);
    }

    public onCloneSong(index: number): void {
        let newSong: Song = Object.assign({}, this.songs[index]);
        this.insertSongs([newSong], index + 1);
    }

    public onMoveUp(index: number): void {
        if (index > 0) {
            let song: Song = this.songs[index];
            this.songs[index] = this.songs[index - 1];
            this.songs[index - 1] = song;
        }
    }

    public onMoveDown(index: number): void {
        if (index < this.songs.length - 1) {
            let song: Song = this.songs[index];
            this.songs[index] = this.songs[index + 1];
            this.songs[index + 1] = song;
        }
    }

    public nextSong(): void {
        this.songHistory.push(this.currentIndex);
        if (!this.shuffle) {
            this.currentIndex = (this.currentIndex + 1) % this.songs.length;
        } else {
            this.currentIndex = Math.floor(Math.random() * Math.floor(this.songs.length));
        }
        this.playCurrentSong();
    }

    public previousSong(): void {
        if (!this.shuffle) {
            this.currentIndex = (this.currentIndex === 0) ? (this.songs.length - 1) : ((this.currentIndex - 1) % this.songs.length);
        } else if (this.songHistory.length > 0) {
            this.currentIndex = this.songHistory.pop();
        }
        this.playCurrentSong();
    }

    public toggleShuffle(): void {
        this.shuffle = !this.shuffle;
    }

    public clear(): void {
        this.songs = [];
        this.currentIndex = 0;
        this.songHistory = [];
        this.audioService.stop();
    }

    public goToBrowser(): void {
        this.onGoToBrowser.emit();
    }

    private insertSongs(newSongs: Array<Song>, index: number): void {
        newSongs.forEach((song) => song.isZeroHeight = true);
        this.songs.splice(index, 0, ...newSongs);
        Observable.timer(0).subscribe( () => {
            for (let song of newSongs) {
                song.isZeroHeight = false;
            }
        });
    }

    private playCurrentSong(): void {
        if (this.songs.length > 0) {
            const currentSong: Song = this.songs[this.currentIndex];
            const nextSong: Song = this.songs[(this.currentIndex + 1) % this.songs.length];
            const url: string = this.createPlayTrackURL(currentSong.path, currentSong.fileName);
            const nextUrl: string = this.appConfig.getApiEndpoint() + PLAY_TRACK_COMMAND + nextSong.path + "/" + nextSong.fileName;
            this.audioService.playSong(url, nextUrl);
        }
    }

    private createPlayTrackURL(path: string, fileName: string): string {
        return this.appConfig.getApiEndpoint() + PLAY_TRACK_COMMAND + encodeURIComponent(path) + "/" + encodeURIComponent(fileName);
    }

    private copySongArray(songs: Array<Song>): Array<Song> {
        let newSongs: Array<Song> = [];
        songs.forEach((song) => {
            newSongs.push(Object.assign({}, song));
        });
        return newSongs;
    }
}
