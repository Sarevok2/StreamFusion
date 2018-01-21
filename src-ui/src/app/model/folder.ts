import {Song} from "./song";
import {TreeItem} from "./tree.item";
export class Folder extends TreeItem {
    constructor (fileName: string, public folders: Folder[], public songs: Song[]) {super(fileName);}
}
