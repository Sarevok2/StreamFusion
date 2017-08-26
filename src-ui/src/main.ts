import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}

let bootstrap = () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
};

if(!!window['cordova']){
    document.addEventListener('deviceready',bootstrap);
}else{
    bootstrap();
}



