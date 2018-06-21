import { Folder } from '../model/folder';
import { Song } from '../model/song';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import {Subject, Observable} from "rxjs";
import { AppConfig } from '../app.config';

const FOLDER_LIST_COMMAND: string = "folders";

@Injectable()
export class FolderService {
    private songDragSubject: Subject<Array<Song>> = new Subject<Array<Song>>();

    constructor (private http: HttpClient,
        private appConfig: AppConfig) {}

    public startDraggingSongs(songs: Array<Song>): void {
        this.songDragSubject.next(songs);
    }

    public getSongDragObs(): Observable<Array<Song>> {
        return this.songDragSubject.asObservable();
    }

    public getFolderList(): Observable<Folder> {
        return this.http.get<Folder>(this.appConfig.getApiEndpoint() + FOLDER_LIST_COMMAND);
    }
}
