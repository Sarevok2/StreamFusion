export abstract class TreeItem {
    public depth: number;
    public expanded: boolean = false;
    public isFolder: boolean = false;
    public parent: TreeItem;
    
    constructor(public fileName: string) {}
}
