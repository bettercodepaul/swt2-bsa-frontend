import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NotificationComponent} from './components/notification';
import {SidebarItemComponent} from './components/sidebar/components/sidebar-item/sidebar-item.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';

import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {ROUTES} from './app.routing';
import {UserDropdownComponent} from './components/navbar/components/user-dropdown/user-dropdown.component';
import {SidebarSubitemComponent} from './components/sidebar/components/sidebar-subitem/sidebar-subitem.component';
import {HomeModule} from './modules/home';
import {ErrorInterceptor, JwtInterceptor, SharedModule} from './modules/shared';
import {APP_REDUCERS} from '@shared/redux-store';
import {VerwaltungModule} from '@verwaltung/verwaltung.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatDialogModule} from '@angular/material/dialog';
import {EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SidebarItemComponent,
    NavbarComponent,
    NotificationComponent,
    UserDropdownComponent,
    SidebarSubitemComponent,
  ],
  imports:      [
    BrowserModule,
    EditorModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide:    TranslateLoader,
        useFactory: createTranslateLoader,
        deps:       [HttpClient]
      }
    }),
    RouterModule.forRoot(ROUTES, {useHash: true, onSameUrlNavigation: 'reload'}),
    /* REDUX-STORE */
    StoreModule.forRoot(APP_REDUCERS),
    EffectsModule.forRoot([]),
    /* BOGENLIGA */
    HomeModule,
    SharedModule.forRoot(),
    VerwaltungModule.forRoot()
  ],
  exports:      [TranslateModule],
  /* HTTP INTERCEPTORS */
  providers:    [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap:    [AppComponent]
})
export class AppModule {
}


