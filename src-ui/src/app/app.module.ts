import { AppConfig } from './app.config';
import { FolderService } from './service/folder.service';
import { PlaylistComponent } from './playlist.component';
import { FolderBrowserComponent } from './folder.browser.component';
import { AudioComponent } from './audio.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, PlaylistComponent, FolderBrowserComponent, AudioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    FolderService,
    AppConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
