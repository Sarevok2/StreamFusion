
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';

const API_ENDPOINT_KEY: string = "apiEndpoint";

@Injectable()
export class AppConfig {
    private savedApiEndpoint: string;

    constructor() {
        this.savedApiEndpoint = window.localStorage.getItem(API_ENDPOINT_KEY);
    }

    public getApiEndpoint(): string {
        if (this.savedApiEndpoint && this.savedApiEndpoint.length > 0) {
            return this.savedApiEndpoint;
        } else if (environment.production === true) {
            return "";
        } else {
            return "http://localhost:8080/";
        }
    }

    public getSavedApiEndpoint(): string {
        return this.savedApiEndpoint;
    }

    public setApiEndpoint(apiEndpoint: string) {
        if (apiEndpoint && apiEndpoint.length > 0) {
            if (apiEndpoint.indexOf("http://") != 0 && apiEndpoint.indexOf("https://") != 0) {
                apiEndpoint = "http://" + apiEndpoint;
            }
            if (apiEndpoint.slice(-1) != "/") {
                apiEndpoint += "/";
            }
        }
        this.savedApiEndpoint = apiEndpoint;
        window.localStorage.setItem(API_ENDPOINT_KEY, apiEndpoint);
    }
};
