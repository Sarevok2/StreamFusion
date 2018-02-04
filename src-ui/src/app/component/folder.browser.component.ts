import { Folder } from '../model/folder';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FolderService } from '../service/folder.service';
import { Song } from "../model/song";
import {TreeItem} from "../model/tree.item";
import {Tree} from "@angular/router/src/utils/tree";

@Component({
    selector: 'folder-browser',
    templateUrl: 'folder.browser.component.html'
})
export class FolderBrowserComponent implements OnInit {
    public dirList: Folder = new Folder("", new Array<Folder>(), new Array<Song>());
    public treeItems: Array<TreeItem> = new Array<TreeItem>();

    @Output() private onAddSongs = new EventEmitter();
    @Output() private onListUpdate = new EventEmitter();
    @Output() private onGoToPlaylist = new EventEmitter();

    public constructor(private folderService: FolderService){}

    ngOnInit(): void {
        this.folderService.getFolderList().subscribe((folderList: Folder) => {
            this.dirList = folderList;
            this.updateDepth(this.dirList, 0);
            for (let subFolder of this.dirList.folders) {
                this.treeItems.push(subFolder);
            }
            for (let song of this.dirList.songs) {
                this.treeItems.push(song);
            }
        });
    }

    public onTreeItemClick(item: TreeItem): void {
        if (!item.isFolder) return;
        let folder: Folder = <Folder>item;
        let index: number = this.treeItems.indexOf(folder);
        if (folder.expanded) {
            let endIndex: number = index + 1;
            while (endIndex < this.treeItems.length && this.treeItems[endIndex].depth > folder.depth) {
                endIndex++;
            }
            this.treeItems.splice(index + 1, endIndex - index - 1);
            this.collapseAll(folder);
        } else {
            let subItems: Array<TreeItem> = (<Array<TreeItem>>folder.folders).concat(folder.songs);
            this.treeItems.splice(index + 1, 0, ...subItems);
            folder.expanded = true;
        }
        this.onListUpdate.emit();
    }

    public onAddItem(item: TreeItem, play: boolean): void {
        let songs: Array<Song> = item.isFolder ? (<Folder>item).songs : [<Song>item];
        this.onAddSongs.emit({songs: songs, play: play});
    }

    public goToPlaylist(): void {
        this.onGoToPlaylist.emit();
    }

    private updateDepth(folder: Folder, depth: number): void {
        for (let subFolder of folder.folders) {
            subFolder.depth = depth + 1;
            subFolder.isFolder = true;
            this.updateDepth(subFolder, depth + 1);
        }
        for (let song of folder.songs) {
            song.depth = depth + 1;
        }
    }

    private collapseAll(folder: Folder): void {
        folder.expanded = false;
        for (let subFolder of folder.folders) {
            this.collapseAll(subFolder);
        }
    }
}
