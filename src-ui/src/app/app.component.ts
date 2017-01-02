import { PlaylistComponent } from './playlist.component';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
    template: `
    <div class="panel">
        <playlist></playlist>
        <folder-browser (onAddSongs)="onAddSongs($event)"></folder-browser>
    </div>`
})
export class AppComponent {
  @ViewChild(PlaylistComponent)
    private playlist: PlaylistComponent;

    onAddSongs(params: any): void {
        this.playlist.addSongs(params);
    }
}
