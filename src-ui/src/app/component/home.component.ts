import {Component, ElementRef, ViewChild} from "@angular/core";
import {PlaylistComponent} from "./playlist.component";
import {AudioComponent} from "./audio.component";
import {ScrollbarComponent} from "./scrollbar.component";

@Component({
    selector: 'home',
    templateUrl: "home.component.html"
})
export class HomeComponent {
    @ViewChild(PlaylistComponent) public playlist: PlaylistComponent;
    public playlistHidden: boolean = true;
    public browserHidden: boolean = false;

    @ViewChild(AudioComponent)
    public audio: AudioComponent;

    public onAddSongs(params: any): void {
        this.playlist.addSongs(params);
    }

    public onPreviousSong(): void {
        this.playlist.previousSong();
    }

    public onNextSong(): void {
        this.playlist.nextSong();
    }

    public showBrowser(): void {
        this.playlistHidden = true;
        this.browserHidden = false;
    }

    public showPlaylist(): void {
        this.playlistHidden = false;
        this.browserHidden = true;
    }
}
