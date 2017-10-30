import { Folder } from '../model/folder';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from "rxjs";
import { AppConfig } from '../app.config';

const FOLDER_LIST_COMMAND: string = "folders";

@Injectable()
export class FolderService {

    constructor (private http:Http,
        private appConfig: AppConfig) {}

    public getFolderList(): Observable<Folder> {
        return this.http.get(this.appConfig.getApiEndpoint() + FOLDER_LIST_COMMAND)
            .map((response: Response) => <Folder>response.json());
    }
}
