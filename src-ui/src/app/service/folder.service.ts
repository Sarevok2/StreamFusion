import { Folder } from '../model/folder';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from "rxjs";
import { AppConfig } from '../app.config';

const FOLDER_LIST_COMMAND: string = "folders";

@Injectable()
export class FolderService {

    constructor (private http:HttpClient,
        private appConfig: AppConfig) {}

    public getFolderList(): Observable<Folder> {
        return this.http.get<Folder>(this.appConfig.getApiEndpoint() + FOLDER_LIST_COMMAND);
    }
}
