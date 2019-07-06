import {Component, ElementRef, ViewChild} from "@angular/core";
import {PlaylistComponent} from "../playlist/playlist.component";
import {AudioComponent} from "../audio/audio.component";

@Component({
    selector: 'home',
    templateUrl: "home.component.html"
})
export class HomeComponent {
    @ViewChild(PlaylistComponent,  {static: false}) public playlist: PlaylistComponent;
    public playlistHidden: boolean = true;
    public browserHidden: boolean = false;

    @ViewChild(AudioComponent,  {static: false})
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
