import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {RouterModule} from '@angular/router';
import {HOME_ROUTES} from './home.routing';
import {FormsModule} from '@angular/forms';
import {HomeComponent} from './components/home/home.component';
import {HomeGuard} from './guards/home.guard';
import {ImpressumComponent} from './components/impressum/impressum.component';


@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    SharedModule.forChild(),
    FormsModule
  ],
  declarations: [HomeComponent, ImpressumComponent],
  providers:    [HomeGuard] // provide Guards here
})
export class HomeModule {
}
