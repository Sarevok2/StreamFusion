export abstract class TreeItem {
    public depth: number;
    public expanded: boolean = false;
    public isFolder: boolean = false;

    constructor(public fileName: string) {}
}
