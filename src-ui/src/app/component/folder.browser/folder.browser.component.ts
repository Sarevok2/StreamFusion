import { Folder } from '../../model/folder';
import {Component, OnInit, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import { FolderService } from '../../service/folder.service';
import { Song } from "../../model/song";
import {TreeItem} from "../../model/tree.item";
import {Tree} from "@angular/router/src/utils/tree";
import {Observable} from "rxjs";

const BROWSE_FOLDERS = "Folders";
const BROWSE_ARTISTS = "Artists";

@Component({
    selector: 'folder-browser',
    templateUrl: 'folder.browser.component.html',
    styleUrls: ['folder.browser.component.css']
})
export class FolderBrowserComponent implements OnInit {
    public dirList: Folder = new Folder("", new Array<Folder>(), new Array<Song>());
    public artistList: Folder = new Folder("", new Array<Folder>(), new Array<Song>());
    public treeItems: Array<TreeItem> = new Array<TreeItem>();
    public filterText: String;
    public triggerFilterUpdate: boolean = false;
    public browseModes = [BROWSE_FOLDERS, BROWSE_ARTISTS];
    public currentBrowseMode: string = this.browseModes[0];
    public isLoading: boolean = true;

    @Output() private onAddSongs = new EventEmitter();
    @Output() private onGoToPlaylist = new EventEmitter();

    @ViewChild('scrollPanel') private scrollPanel: ElementRef;

    public constructor(private folderService: FolderService) {}

    ngOnInit(): void {
        this.folderService.getFolderList().subscribe((folderList: Folder) => {
            this.dirList = folderList;
            this.initFolderList(this.dirList, 0);
            this.updateTreeItems();
            this.isLoading = false;
        });
    }

    public onTreeItemClick(item: TreeItem): void {
        if (!item.isFolder) {
            return;
        }
        let folder: Folder = <Folder>item;
        let index: number = this.treeItems.indexOf(folder);
        if (folder.expanded) {
            let endIndex: number = index + 1;
            while (endIndex < this.treeItems.length && this.treeItems[endIndex].depth > folder.depth) {
                endIndex++;
            }
            for (let i = index + 1; i < endIndex; i++) {
                this.treeItems[i].isZeroHeight = true;
            }
            const transitionEndFn = () => {
                this.treeItems.splice(index + 1, endIndex - index - 1);
                this.collapseAll(folder);
                this.scrollPanel.nativeElement.removeEventListener('transitionend', transitionEndFn);
            }
            this.scrollPanel.nativeElement.addEventListener('transitionend', transitionEndFn);
        } else {
            let subItems: Array<TreeItem> = (<Array<TreeItem>>folder.folders).concat(folder.songs);
            Observable.timer(0).subscribe( () => {
                for (let subItem of subItems) {
                    subItem.isZeroHeight = false;
                }
            });
            this.treeItems.splice(index + 1, 0, ...subItems);
            folder.expanded = true;
        }
        this.triggerFilterUpdate = !this.triggerFilterUpdate;
    }

    public onAddItem(item: TreeItem, play: boolean): void {
        let songs: Array<Song> = item.isFolder ? (<Folder>item).songs : [<Song>item];
        this.onAddSongs.emit({songs: songs, play: play});
    }

    public goToPlaylist(): void {
        this.onGoToPlaylist.emit();
    }

    public onBrowseModeChange(): void {
        if (this.currentBrowseMode === BROWSE_ARTISTS && this.artistList.folders.length === 0) {
            this.isLoading = true;
            Observable.timer(0).subscribe(() => {
                this.initArtistList(this.dirList);
                console.log(3, this.artistList);
                this.artistList.folders.sort((folder1, folder2) => folder1.fileName.localeCompare(folder2.fileName));
                this.updateTreeItems();
                this.isLoading = false;
            });
        } else {
            this.updateTreeItems();
        }
    }

    private initArtistList(folderList: Folder): void {
        for (let song of folderList.songs) {
            this.addSongToArtistList(song);
        }
        for (let folder of folderList.folders) {
            this.initArtistList(folder);
        }
    }

    private updateTreeItems(): void {
        let currentList: Folder = (this.currentBrowseMode === BROWSE_FOLDERS) ? this.dirList : this.artistList;
        this.treeItems = [];
        for (let subFolder of currentList.folders) {
            this.treeItems.push(subFolder);
            subFolder.isZeroHeight = false;
        }
        for (let song of currentList.songs) {
            this.treeItems.push(song);
        }
        this.triggerFilterUpdate = !this.triggerFilterUpdate;
    }

    private addSongToArtistList(song: Song): void {
        let artistName = song.artist || "No Artist";
        let artistFolder: Folder = this.artistList.folders.find(folder => folder.fileName.toUpperCase() === artistName.toUpperCase());
        if (!artistFolder) {
            artistFolder = new Folder(artistName, [], []);
            artistFolder.isFolder = true;
            artistFolder.isZeroHeight = true;
            artistFolder.parent = this.artistList;
            artistFolder.depth = 1;
            this.artistList.folders.push(artistFolder);
        }
        let newSong: Song = Object.assign({}, song);
        let albumFolder: Folder;
        if (song.album) {
            albumFolder = artistFolder.folders.find(folder => folder.fileName.toUpperCase() === song.album.toUpperCase());
            if (!albumFolder) {
                albumFolder = new Folder(song.album, [], []);
                albumFolder.isFolder = true;
                albumFolder.depth = 2;
                albumFolder.parent = artistFolder;
                artistFolder.folders.push(albumFolder);
            }
            newSong.depth = 3;
        } else {
            albumFolder = artistFolder;
            newSong.depth = 2;
        }
        albumFolder.songs.push(newSong);
    }

    private initFolderList(folder: Folder, depth: number): void {
        for (let subFolder of folder.folders) {
            subFolder.depth = depth + 1;
            subFolder.isFolder = true;
            subFolder.isZeroHeight = true;
            subFolder.parent = folder;
            this.initFolderList(subFolder, depth + 1);
        }
        for (let song of folder.songs) {
            song.depth = depth + 1;
            song.parent = folder;
            song.isZeroHeight = true;
        }
    }

    private collapseAll(folder: Folder): void {
        folder.expanded = false;
        for (let subFolder of folder.folders) {
            this.collapseAll(subFolder);
        }
    }
}
