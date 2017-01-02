import { FolderList } from './model/folder.list';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FolderService } from './service/folder.service';
import { Song } from "./model/song";

@Component({
    selector: 'folder-browser',
    templateUrl: './folder.browser.component.html'
})
export class FolderBrowserComponent implements OnInit {
    private currentDir: string = "";
    public dirList: FolderList = new FolderList([],[]);
    @Output() private onAddSongs = new EventEmitter();

    public constructor(private folderService: FolderService){}

    ngOnInit() {
       this.updateList();
    }

    public onFolderClick(folder: string): void {
        this.currentDir += "/" + folder;
        this.updateList();
    }

    public goUp(): void {
        const index = this.currentDir.lastIndexOf('/');
        if (index >= 0) {
            this.currentDir = this.currentDir.substring(0,index);
        }
        this.updateList();
    }

    public goUpVisible(): boolean {
        return this.currentDir != "";
    }

    public onAddSong(songName: string, play: boolean) {
        const song: Song = new Song(this.currentDir, songName);
        this.onAddSongs.emit({songs: [song], play: play});
    }

    public onAddDir(dir: string, play: boolean) {
        const subDir = this.currentDir + "/" + dir
        this.folderService.getFolderList(subDir).subscribe((folderList: FolderList) => {
            let songList: Array<Song> = [];
            for (let songName of folderList.files) {
                songList.push(new Song(subDir, songName));
            }
            this.onAddSongs.emit({songs: songList, play: play});
        });
    }


    private updateList(): void {
        this.folderService.getFolderList(this.currentDir).subscribe((folderList: FolderList) => {
            this.dirList = folderList;
        });
    }
}
