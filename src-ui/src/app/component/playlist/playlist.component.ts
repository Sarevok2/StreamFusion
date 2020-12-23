import { FolderService } from './../../service/folder.service';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {Song} from "app/model/song";
import { AppConfig } from '../../app.config';
import {AudioService} from "app/service/audio.service";
import { timer } from "rxjs";

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
    private currentDropTarget: Song;
    private currentDropTargetIndex: number;
    private draggedSongIndex: number;
    private externalDraggedSongs: Array<Song>;
    private draggingPlaylistSong: boolean = false;
    @Output() private onGoToBrowser = new EventEmitter();

    @ViewChild('scrollPanel',  {static: false}) private scrollPanel: ElementRef;

    constructor (private appConfig: AppConfig, private audioService: AudioService, private folderService: FolderService) {}

    ngOnInit(): void {
        this.folderService.getSongDragObs().subscribe((songs) => {
            this.externalDraggedSongs = songs;
            this.draggingPlaylistSong = false;
        });
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
        this.removeSong(index);
    }

    public onCloneSong(index: number): void {
        let newSong: Song = Object.assign({}, this.songs[index]);
        this.insertSongs([newSong], index + 1);
    }

    public onMoveUp(index: number): void {
        if (index > 0) {
            let prevSong: Song = Object.assign({}, this.songs[index - 1]);
            this.removeSong(index - 1);
            this.insertSongs([prevSong], index + 1);
        }
    }

    public onMoveDown(index: number): void {
        if (index < this.songs.length - 1) {
            let nextSong: Song = Object.assign({}, this.songs[index + 1]);
            this.insertSongs([nextSong], index);
            this.removeSong(index + 2);
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

    public onDragStart(song: Song, index: number): void {
        this.draggedSongIndex = index;
        this.draggingPlaylistSong = true;
    }

    public onDrop(event: DragEvent): void {
        event.preventDefault();
        this.currentDropTarget.isDragTarget = false;
        this.currentDropTarget.isFirstDragTarget = false;
        if (this.draggingPlaylistSong && this.currentDropTargetIndex !== this.draggedSongIndex &&
                this.currentDropTargetIndex !== (this.draggedSongIndex - 1)) {
            let newIndex: number = this.currentDropTargetIndex + 1;
            let draggedSongCopy: Song = Object.assign({}, this.songs[this.draggedSongIndex]);
            this.insertSongs([draggedSongCopy], newIndex);
            if (newIndex < this.draggedSongIndex) {
                this.draggedSongIndex++;
            }
            this.removeSong(this.draggedSongIndex);
        } else if (!this.draggingPlaylistSong) {
            let newSongs: Array<Song> = this.copySongArray(this.externalDraggedSongs);
            this.insertSongs(newSongs, this.currentDropTargetIndex + 1);
        }
        this.draggingPlaylistSong = false;
    }

    public onDragEnter(song: Song, index: number): void {
        song.isDragTarget = true;
        this.updateDropTarget(song, index);
    }

    public onHeaderDragEnter(): void {
        if (this.songs.length > 0) {
            let song: Song = this.songs[0];
            song.isFirstDragTarget = true;
            this.updateDropTarget(song, -1);
        }
    }

    private updateDropTarget(song: Song, index: number) {
        if (this.currentDropTarget && song !== this.currentDropTarget) {
            this.currentDropTarget.isDragTarget = false;
            this.currentDropTarget.isFirstDragTarget = false;
        }
        this.currentDropTarget = song;
        this.currentDropTargetIndex = index;
    }

    public goToBrowser(): void {
        this.onGoToBrowser.emit();
    }

    private removeSong(index: number): void {
        this.songs[index].isZeroHeight = true;
        const transitionEndFn = () => {
            this.songs.splice(index, 1);
            this.songHistory = [];
            this.scrollPanel.nativeElement.removeEventListener('transitionend', transitionEndFn);
        };
        this.scrollPanel.nativeElement.addEventListener('transitionend', transitionEndFn);
    }

    private insertSongs(newSongs: Array<Song>, index: number): void {
        newSongs.forEach((song) => song.isZeroHeight = true);
        this.songs.splice(index, 0, ...newSongs);
        timer(0).subscribe( () => {
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
