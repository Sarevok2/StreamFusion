export abstract class TreeItem {
    public depth: number;
    public expanded: boolean;
    public isFolder: boolean;
    public isZeroHeight: boolean;
    public parent: TreeItem;

    constructor(public fileName: string) {}
}
