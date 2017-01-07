webpackJsonp([0,3],{

/***/ 210:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__environments_environment__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppConfig; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppConfig = (function () {
    function AppConfig() {
    }
    AppConfig.prototype.getApiEndpoint = function () {
        if (__WEBPACK_IMPORTED_MODULE_0__environments_environment__["a" /* environment */].production === true) {
            return "";
        }
        else {
            return "http://localhost:8080/";
        }
    };
    AppConfig = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* Injectable */])(), 
        __metadata('design:paramtypes', [])
    ], AppConfig);
    return AppConfig;
}());
;
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/app.config.js.map

/***/ },

/***/ 322:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playlist_component__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent.prototype.onAddSongs = function (params) {
        this.playlist.addSongs(params);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_22" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_0__playlist_component__["a" /* PlaylistComponent */]), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__playlist_component__["a" /* PlaylistComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__playlist_component__["a" /* PlaylistComponent */]) === 'function' && _a) || Object)
    ], AppComponent.prototype, "playlist", void 0);
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["G" /* Component */])({
            selector: 'app-root',
            template: "\n    <div class=\"panel\">\n        <playlist></playlist>\n        <folder-browser (onAddSongs)=\"onAddSongs($event)\"></folder-browser>\n    </div>"
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/app.component.js.map

/***/ },

/***/ 323:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AudioComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PLAY_IMAGE = "assets/svg/play.svg";
var PAUSE_IMAGE = "assets/svg/pause.svg";
var AudioComponent = (function () {
    function AudioComponent() {
        this.onSongEnded = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* EventEmitter */]();
        this.isPlaying = false;
        this.playPauseImage = PLAY_IMAGE;
        this.currentTime = "0.00";
        this.duration = "0.00";
    }
    AudioComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.audioElement = document.getElementById("audio-player");
        this.seekBarElement = document.getElementById("seek-bar");
        this.audioElement.addEventListener("timeupdate", function () { return _this.timeUpdate(); }, false);
    };
    AudioComponent.prototype.play = function (url) {
        var _this = this;
        this.audioElement.src = url;
        this.audioElement.load();
        this.audioElement.addEventListener('loadeddata', function () {
            _this.duration = _this.formatTime(_this.audioElement.duration);
            _this.resume();
        });
    };
    AudioComponent.prototype.resume = function () {
        var _this = this;
        if (this.audioElement.readyState >= 2) {
            this.audioElement.play();
            this.audioElement.addEventListener("ended", function () { return _this.onSongEnded.emit(); });
            this.playPauseImage = PAUSE_IMAGE;
            this.isPlaying = true;
        }
    };
    AudioComponent.prototype.stop = function () {
        this.audioElement.pause();
        this.playPauseImage = PLAY_IMAGE;
        this.isPlaying = false;
    };
    AudioComponent.prototype.onPlayPause = function () {
        if (this.isPlaying) {
            this.stop();
        }
        else {
            this.resume();
        }
    };
    AudioComponent.prototype.onSeekBarClick = function (event) {
        var newPosition = (event.offsetX / this.seekBarElement.offsetWidth);
        this.seekMarkerPos = (newPosition * 100) + "%";
        this.audioElement.currentTime = this.audioElement.duration * newPosition;
    };
    AudioComponent.prototype.timeUpdate = function () {
        this.seekMarkerPos = (100 * (this.audioElement.currentTime / this.audioElement.duration)) + "%";
        var currentSeconds = this.audioElement.currentTime;
        if (!isNaN(currentSeconds)) {
            this.currentTime = this.formatTime(currentSeconds);
        }
    };
    AudioComponent.prototype.formatTime = function (seconds) {
        var dateString = new Date(seconds * 1000).toISOString();
        var offset = 4;
        if (seconds >= 600 && seconds < 3600) {
            offset = 3;
        }
        else if (seconds >= 3600) {
            offset = 1;
        }
        return dateString.substr(11 + offset, 8 - offset);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* EventEmitter */]) === 'function' && _a) || Object)
    ], AudioComponent.prototype, "onSongEnded", void 0);
    AudioComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'audioPlayer',
            template: __webpack_require__(649)
        }), 
        __metadata('design:paramtypes', [])
    ], AudioComponent);
    return AudioComponent;
    var _a;
}());
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/audio.component.js.map

/***/ },

/***/ 324:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__audio_component__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_config__ = __webpack_require__(210);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return PlaylistComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PLAY_TRACK_COMMAND = "playtrack?fullpath=";
var PlaylistComponent = (function () {
    function PlaylistComponent(appConfig) {
        this.appConfig = appConfig;
        this.songs = [];
        this.expanded = true;
        this.currentIndex = 0;
    }
    PlaylistComponent.prototype.addSongs = function (params) {
        if (params.play) {
            this.currentIndex = 0;
            this.songs = params.songs;
            this.playCurrentSong();
        }
        else {
            this.songs = this.songs.concat(params.songs);
        }
    };
    PlaylistComponent.prototype.toggleExpanded = function () {
        this.expanded = !this.expanded;
    };
    PlaylistComponent.prototype.onPlaySong = function (index) {
        this.currentIndex = index;
        this.playCurrentSong();
    };
    PlaylistComponent.prototype.onRemoveSong = function (index) {
        this.songs.splice(index, 1);
    };
    PlaylistComponent.prototype.nextSong = function () {
        this.currentIndex = (this.currentIndex + 1) % this.songs.length;
        this.playCurrentSong();
    };
    PlaylistComponent.prototype.previous = function () {
        this.currentIndex = (this.currentIndex == 0) ? (this.songs.length - 1) : ((this.currentIndex - 1) % this.songs.length);
        this.playCurrentSong();
    };
    PlaylistComponent.prototype.onSongEnded = function () {
        this.nextSong();
    };
    PlaylistComponent.prototype.clear = function () {
        this.songs = [];
        this.currentIndex = 0;
        this.audio.stop();
    };
    PlaylistComponent.prototype.playCurrentSong = function () {
        var currentSong = this.songs[this.currentIndex];
        var url = this.appConfig.getApiEndpoint() + PLAY_TRACK_COMMAND + currentSong.path + "/" + currentSong.name;
        this.audio.play(url);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_22" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1__audio_component__["a" /* AudioComponent */]), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__audio_component__["a" /* AudioComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__audio_component__["a" /* AudioComponent */]) === 'function' && _a) || Object)
    ], PlaylistComponent.prototype, "audio", void 0);
    PlaylistComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'playlist',
            template: __webpack_require__(651)
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__app_config__["a" /* AppConfig */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__app_config__["a" /* AppConfig */]) === 'function' && _b) || Object])
    ], PlaylistComponent);
    return PlaylistComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/playlist.component.js.map

/***/ },

/***/ 325:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(654);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_config__ = __webpack_require__(210);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FolderService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var FOLDER_LIST_COMMAND = "folders?directory=";
var FolderService = (function () {
    function FolderService(http, appConfig) {
        this.http = http;
        this.appConfig = appConfig;
    }
    FolderService.prototype.getFolderList = function (subDir) {
        return this.http.get(this.appConfig.getApiEndpoint() + FOLDER_LIST_COMMAND + subDir)
            .map(function (response) { return response.json(); });
    };
    FolderService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__app_config__["a" /* AppConfig */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__app_config__["a" /* AppConfig */]) === 'function' && _b) || Object])
    ], FolderService);
    return FolderService;
    var _a, _b;
}());
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/folder.service.js.map

/***/ },

/***/ 326:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return environment; });
var environment = {
    production: true
};
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/environment.prod.js.map

/***/ },

/***/ 391:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 391;


/***/ },

/***/ 392:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(495);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__polyfills_ts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app___ = __webpack_require__(492);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["_24" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app___["a" /* AppModule */]);
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/main.js.map

/***/ },

/***/ 490:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_config__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_folder_service__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__playlist_component__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__folder_browser_component__ = __webpack_require__(491);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__audio_component__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_forms__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_http__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_component__ = __webpack_require__(322);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* AppComponent */], __WEBPACK_IMPORTED_MODULE_2__playlist_component__["a" /* PlaylistComponent */], __WEBPACK_IMPORTED_MODULE_3__folder_browser_component__["a" /* FolderBrowserComponent */], __WEBPACK_IMPORTED_MODULE_4__audio_component__["a" /* AudioComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["b" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_7__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_http__["b" /* HttpModule */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_1__service_folder_service__["a" /* FolderService */],
                __WEBPACK_IMPORTED_MODULE_0__app_config__["a" /* AppConfig */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/app.module.js.map

/***/ },

/***/ 491:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_folder_list__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_folder_service__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_song__ = __webpack_require__(494);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FolderBrowserComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var FolderBrowserComponent = (function () {
    function FolderBrowserComponent(folderService) {
        this.folderService = folderService;
        this.currentDir = "";
        this.dirList = new __WEBPACK_IMPORTED_MODULE_0__model_folder_list__["a" /* FolderList */]([], []);
        this.onAddSongs = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["_7" /* EventEmitter */]();
    }
    FolderBrowserComponent.prototype.ngOnInit = function () {
        this.updateList();
    };
    FolderBrowserComponent.prototype.onFolderClick = function (folder) {
        this.currentDir += "/" + folder;
        this.updateList();
    };
    FolderBrowserComponent.prototype.goUp = function () {
        var index = this.currentDir.lastIndexOf('/');
        if (index >= 0) {
            this.currentDir = this.currentDir.substring(0, index);
        }
        this.updateList();
    };
    FolderBrowserComponent.prototype.goUpVisible = function () {
        return this.currentDir != "";
    };
    FolderBrowserComponent.prototype.onAddSong = function (songName, play) {
        var song = new __WEBPACK_IMPORTED_MODULE_3__model_song__["a" /* Song */](this.currentDir, songName);
        this.onAddSongs.emit({ songs: [song], play: play });
    };
    FolderBrowserComponent.prototype.onAddDir = function (dir, play) {
        var _this = this;
        var subDir = this.currentDir + "/" + dir;
        this.folderService.getFolderList(subDir).subscribe(function (folderList) {
            var songList = [];
            for (var _i = 0, _a = folderList.files; _i < _a.length; _i++) {
                var songName = _a[_i];
                songList.push(new __WEBPACK_IMPORTED_MODULE_3__model_song__["a" /* Song */](subDir, songName));
            }
            _this.onAddSongs.emit({ songs: songList, play: play });
        });
    };
    FolderBrowserComponent.prototype.updateList = function () {
        var _this = this;
        this.folderService.getFolderList(this.currentDir).subscribe(function (folderList) {
            _this.dirList = folderList;
        });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["C" /* Output */])(), 
        __metadata('design:type', Object)
    ], FolderBrowserComponent.prototype, "onAddSongs", void 0);
    FolderBrowserComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["G" /* Component */])({
            selector: 'folder-browser',
            template: __webpack_require__(650)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_folder_service__["a" /* FolderService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__service_folder_service__["a" /* FolderService */]) === 'function' && _a) || Object])
    ], FolderBrowserComponent);
    return FolderBrowserComponent;
    var _a;
}());
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/folder.browser.component.js.map

/***/ },

/***/ 492:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(490);
/* unused harmony namespace reexport */
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__app_module__["a"]; });


//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/index.js.map

/***/ },

/***/ 493:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FolderList; });
var FolderList = (function () {
    function FolderList(folders, files) {
        this.folders = folders;
        this.files = files;
    }
    return FolderList;
}());
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/folder.list.js.map

/***/ },

/***/ 494:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Song; });
var Song = (function () {
    function Song(path, name) {
        this.path = path;
        this.name = name;
    }
    ;
    return Song;
}());
//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/song.js.map

/***/ },

/***/ 495:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(502);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(498);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(504);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(503);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(501);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(500);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(497);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(510);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(931);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=C:/Users/louis/IdeaProjects/MusicStream/src-ui/src/polyfills.js.map

/***/ },

/***/ 649:
/***/ function(module, exports) {

module.exports = "<audio id=\"audio-player\" preload=\"none\">\r\n    <source id=\"audiosource\" type=\"audio/mpeg\">\r\n    Your browser does not support the audio element.\r\n</audio>\r\n<button class=\"play-button\" (click)=\"onPlayPause()\"><img [src]=\"playPauseImage\" alt=\"play/pause\" width=\"20\" height=\"20\"></button>\r\n{{currentTime}}/{{duration}}\r\n<div id=\"seek-bar\" class=\"seek-bar\" (click)=\"onSeekBarClick($event)\">\r\n\t <div [style.marginLeft]=\"seekMarkerPos\" id=\"seek-marker\" class=\"seek-marker\"></div>\r\n</div>\r\n"

/***/ },

/***/ 650:
/***/ function(module, exports) {

module.exports = "<h3>\r\n    Folders\r\n    <span class=\"file-link\" *ngIf=\"goUpVisible()\" (click)=\"goUp()\"><img src=\"assets/svg/upload.svg\" width=\"20\" height=\"20\"></span>\r\n</h3>\r\n\r\n<div class=\"folder-item\" *ngFor=\"let folder of dirList.folders\">\r\n    <span class=\"file-link\" (click)=\"onFolderClick(folder)\">{{folder}}</span>\r\n    <div class=\"button-bar\">\r\n        <button (click)=\"onAddDir(folder, true)\"><img src=\"assets/svg/play.svg\" width=\"20\" height=\"20\"></button>\r\n        <button (click)=\"onAddDir(folder, false)\"><img src=\"assets/svg/add.svg\" width=\"20\" height=\"20\"></button>\r\n    </div>\r\n</div>\r\n\r\n<h3>Songs</h3>\r\n<div class=\"folder-item\" *ngFor=\"let file of dirList.files\">\r\n    {{file}}\r\n    <div class=\"button-bar\">\r\n        <button (click)=\"onAddSong(file, true)\"><img src=\"assets/svg/play.svg\" width=\"20\" height=\"20\"></button>\r\n        <button (click)=\"onAddSong(file, false)\"><img src=\"assets/svg/add.svg\" width=\"20\" height=\"20\"></button>\r\n    </div>\r\n</div>"

/***/ },

/***/ 651:
/***/ function(module, exports) {

module.exports = "<div class=\"panel\">\r\n    <div style=\"height: 30px; margin-bottom: 10px\">\r\n        <audioPlayer (onSongEnded)=\"onSongEnded($event)\"></audioPlayer>\r\n        <div style=\"float: right\">\r\n            <button (click)=\"previous()\"><img src=\"assets/svg/previous.svg\" width=\"20\" height=\"20\"></button><!--{{action 'prev'}}-->\r\n            <button (click)=\"nextSong()\"><img src=\"assets/svg/next.svg\" width=\"20\" height=\"20\"></button> <!--{{action 'next'}}-->\r\n        </div>\r\n    </div>\r\n    <h3>\r\n        Playlist\r\n        <button (click)=\"toggleExpanded()\"><img src=\"assets/svg/collapse.svg\" width=\"20\" height=\"20\"></button>\r\n        <button (click)=\"clear()\"><img src=\"assets/svg/remove-symbol.svg\" width=\"20\" height=\"20\"></button>\r\n    </h3>\r\n\r\n    <div id=\"playlist-container\" class=\"playlist-expanded\" *ngIf=\"expanded\">\r\n        <div class=\"playlist-item\" *ngFor=\"let song of songs; let i = index\">\r\n            <span *ngIf=\"i == currentIndex\">* </span>{{(i+1) + \" - \" + song.name}}\r\n            <div class=\"button-bar\">\r\n                <button (click)=\"onPlaySong(i)\"><img src=\"assets/svg/play.svg\" width=\"20\" height=\"20\"></button>\r\n                <button (click)=\"onRemoveSong(i)\"><img src=\"assets/svg/remove-symbol.svg\" width=\"20\" height=\"20\"></button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n"

/***/ },

/***/ 932:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(392);


/***/ }

},[932]);
//# sourceMappingURL=main.bundle.map