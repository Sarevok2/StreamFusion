import { AppConfig } from './app.config';
import { FolderService } from './service/folder.service';
import { PlaylistComponent } from './component/playlist.component';
import { FolderBrowserComponent } from './component/folder.browser.component';
import { AudioComponent } from './component/audio.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './component/app.component';
import { HomeComponent } from './component/home.component';
import { ScrollbarComponent } from './component/scrollbar.component';
import { SettingsComponent } from "./component/settings.component";
import { Routes, RouterModule } from "@angular/router";
import { AudioService } from "./service/audio.service";

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
    AppComponent, HomeComponent, PlaylistComponent, FolderBrowserComponent, AudioComponent, SettingsComponent, ScrollbarComponent
  ],
  imports: [
    RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    FolderService,
    AudioService,
    AppConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
