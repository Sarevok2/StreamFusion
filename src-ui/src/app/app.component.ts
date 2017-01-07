import { PlaylistComponent } from './playlist.component';
import { Component, ViewChild } from '@angular/core';
import {AudioComponent} from "./audio.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild(PlaylistComponent)
  private playlist: PlaylistComponent;

  @ViewChild(AudioComponent)
  private audio: AudioComponent;

    onAddSongs(params: any): void {
        this.playlist.addSongs(params);
    }
}
