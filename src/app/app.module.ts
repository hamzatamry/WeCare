import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NgModule } from '@angular/core';
import { AuthInterceptor } from './auth/auth-interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import 'chartjs-plugin-zoom';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    OneSignal
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
