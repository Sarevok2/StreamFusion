import { SongFilterPipe } from './pipe/song.filter.pipe';
import { AppConfig } from './app.config';
import { FolderService } from './service/folder.service';
import { PlaylistComponent } from './component/playlist/playlist.component';
import { FolderBrowserComponent } from './component/folder.browser/folder.browser.component';
import { AudioComponent } from './component/audio/audio.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './component/app/app.component';
import { HomeComponent } from './component/home/home.component';
import { SettingsComponent } from "./component/settings/settings.component";
import { Routes, RouterModule } from "@angular/router";
import { AudioService } from "./service/audio.service";
import { SliderComponent } from './component/slider/slider.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'settings', component: SettingsComponent },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, PlaylistComponent, FolderBrowserComponent,
      AudioComponent, SettingsComponent, SliderComponent, SongFilterPipe
  ],
  imports: [
    RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    FolderService,
    AudioService,
    AppConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
