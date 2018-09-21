import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { DetailsComponent } from './components/details/details.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppModule, createTranslateLoader } from '../../app.module';
import {RoutingModule} from './../../routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [OverviewComponent, DetailsComponent]
})
export class SettingsModule {}
