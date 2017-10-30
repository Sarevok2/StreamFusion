export class Song {
    public constructor(public path: string, public fileName: string, public artist?: string,
                       public album?: string, public title?: string, public track?: string, public lastModified?: string) {};
}
