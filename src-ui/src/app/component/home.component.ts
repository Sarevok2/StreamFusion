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
    @ViewChild('browserScrollbar') private browserScrollbar: ScrollbarComponent;
    @ViewChild('playlistScrollbar') private playlistScrollbar: ScrollbarComponent;

    @ViewChild(AudioComponent)
    public audio: AudioComponent;

    public onAddSongs(params: any): void {
        this.playlist.addSongs(params);
    }

    public updateBrowserScrollbar(): void {
        this.browserScrollbar.updateSize();
    }

    public updatePlaylistScrollbar(): void {
        this.playlistScrollbar.updateSize();
    }

    public onPreviousSong(): void {
        this.playlist.previousSong();
    }

    public onNextSong(): void {
        this.playlist.nextSong();
    }
}
