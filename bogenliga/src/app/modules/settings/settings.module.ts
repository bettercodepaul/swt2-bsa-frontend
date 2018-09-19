import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { DetailsComponent } from './components/details/details.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {AppModule, HttpLoaderFactory} from '../../app.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [OverviewComponent, DetailsComponent]
})
export class SettingsModule { }
