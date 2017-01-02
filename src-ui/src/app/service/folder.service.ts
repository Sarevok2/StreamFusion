import { FolderList } from '../model/folder.list';
import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from "rxjs";
import { AppConfig } from '../app.config';


const FOLDER_LIST_COMMAND: string = "folders?directory=";

@Injectable()
export class FolderService {

    constructor (private http:Http,
        private appConfig: AppConfig) {}

    public getFolderList(subDir: string): Observable<FolderList> {
        return this.http.get(this.appConfig.getApiEndpoint() + FOLDER_LIST_COMMAND + subDir)
            .map((response: Response) => <FolderList>response.json());
    }
}
