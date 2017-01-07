
import { environment } from '../environments/environment';
import { OpaqueToken } from "@angular/core";
import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {
    public getApiEndpoint(): string {
        if (environment.production === true) {
            return "";
        } else {
            return "http://localhost:8080/";
        }
    }
};
