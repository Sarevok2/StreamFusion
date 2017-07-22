import {Component, ViewChild} from "@angular/core";
import {PlaylistComponent} from "./playlist.component";
import {AudioComponent} from "./audio.component";

@Component({
    selector: 'home',
    templateUrl: "home.component.html"
})
export class HomeComponent {
    @ViewChild(PlaylistComponent)
    public playlist: PlaylistComponent;

    @ViewChild(AudioComponent)
    public audio: AudioComponent;

    public onAddSongs(params: any): void {
        this.playlist.addSongs(params);
    }
}
