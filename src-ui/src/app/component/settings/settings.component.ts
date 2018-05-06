import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AppConfig} from "../../app.config";

@Component({
    selector: 'settings-dialog',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.css']
})
export class SettingsComponent implements OnInit {
    public serverUrl: string;

    constructor(private router: Router, private appConfig: AppConfig) { }

    ngOnInit(): void {
        this.serverUrl = this.appConfig.getSavedApiEndpoint();
    }

    public onOkClick(): void {
        this.appConfig.setApiEndpoint(this.serverUrl);
        this.router.navigate(["home"]);
    }

    public onCancelClick(): void {
        this.router.navigate(["home"]);
    }
}
