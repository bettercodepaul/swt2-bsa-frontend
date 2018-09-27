import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationComponent } from './components/notification';

// import ngx-translate and the http loader
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {APP_REDUCERS} from './modules/shared/redux-store/app.reducer';
import {RouterModule, RouterOutlet} from '@angular/router';
import {ROUTES} from './app.routing';
import {FormsModule} from '@angular/forms';
import { WettkaempfeComponent } from './modules/wettkampf/components/wettkaempfe/wettkaempfe.component';
import {HomeModule} from './modules/home/home.module';
import {WettkampfModule} from "./modules/wettkampf/wettkampf.module";
import {LoginModule} from "./modules/login/login.module";
import {RouterTestingModule} from '@angular/router/testing';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(ROUTES),
    /* REDUX-STORE */
    StoreModule.forRoot(APP_REDUCERS),
    EffectsModule.forRoot([]),
    FormsModule,
    HomeModule,
    WettkampfModule,
    LoginModule
  ],
  exports: [TranslateModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}


