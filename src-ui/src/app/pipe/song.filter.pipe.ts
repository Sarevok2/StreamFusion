import { Song } from './../model/song';
import { Folder } from './../model/folder';
import { TreeItem } from './../model/tree.item';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'songFilter' })
export class SongFilterPipe implements PipeTransform {
    transform(items: TreeItem[], filterText: string, triggerChange: boolean) {
        if (!filterText) {
            return items;
        }
        return items.filter(item => this.searchForText(item, filterText));
    }

    private searchForText(item: TreeItem, filterText: string): boolean {
        return this.searchParents(item, filterText) ||
                this.searchChildren(item, filterText);
    }

    private searchChildren(item: TreeItem, filterText: string): boolean {
        if (item.isFolder) {
            let folder: Folder = <Folder>item;
            for (let i = 0; i < folder.songs.length; i++) {
                if (folder.songs[i].fileName.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
                    return true;
                }
            }
            for (let i = 0; i < folder.folders.length; i++) {
                if (this.searchForText(folder.folders[i], filterText)) {
                    return true;
                }
            }
        }
        return false;
    }

    private searchParents(item: TreeItem, filterText: string): boolean {
        if (item.fileName.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
            return true;
        } else if (item.parent) {
            return this.searchParents(item.parent, filterText);
        }
        return false;
    }
}
