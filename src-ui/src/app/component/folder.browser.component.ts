import { Folder } from '../model/folder';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FolderService } from '../service/folder.service';
import { Song } from "../model/song";

@Component({
    selector: 'folder-browser',
    templateUrl: 'folder.browser.component.html'
})
export class FolderBrowserComponent implements OnInit {
    public dirList: Folder = new Folder(new Map<string, Folder>(),[]);
    public currentFolder: Folder = this.dirList;
    private currentPath: Folder[] = new Array<Folder>();

    @Output() private onAddSongs = new EventEmitter();

    public constructor(private folderService: FolderService){}

    ngOnInit(): void {
        this.folderService.getFolderList().subscribe((folderList: Folder) => {
            this.dirList = folderList;
            this.currentPath.push(this.dirList);
            this.currentFolder = this.dirList;
        });
    }

    public onFolderClick(folder: string): void {
        const newFolder: Folder = this.currentFolder.folders[folder];
        if (newFolder) {
            this.currentPath.push(newFolder);
            this.currentFolder = newFolder;
        }
    }

    public goUp(): void {
        if (this.currentPath.length > 1) {
            this.currentPath.pop();
            this.currentFolder = this.currentPath[this.currentPath.length - 1];
        }
    }

    public goUpVisible(): boolean {
        return this.currentPath.length > 1;
    }

    public onAddSong(song: Song, play: boolean): void {
        this.onAddSongs.emit({songs: [song], play: play});
    }

    public onAddDir(dir: string, play: boolean): void {
        const subDir: Folder = this.currentFolder.folders[dir];
        if (subDir) {
            this.onAddSongs.emit({songs: subDir.songs, play: play});
        }
    }

    public getFolderNames(): any {
        return Object.keys(this.currentFolder.folders);
    }
}
