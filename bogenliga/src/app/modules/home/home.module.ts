import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared';
import {HomeComponent} from './components/home/home.component';
import {ImpressumComponent} from './components/impressum/impressum.component';
import {HomeGuard} from './guards/home.guard';
import {BUTTON_ROUTES, HOME_ROUTES} from './home.routing';



@NgModule({
  imports:      [
    RouterModule.forChild(BUTTON_ROUTES),
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
