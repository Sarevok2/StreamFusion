import {TreeItem} from "./tree.item";

export class Song extends TreeItem {
    public constructor(public path: string, fileName: string, public artist?: string,
                       public album?: string, public title?: string, public track?: string,
                       public lastModified?: string) {super(fileName)};
}
