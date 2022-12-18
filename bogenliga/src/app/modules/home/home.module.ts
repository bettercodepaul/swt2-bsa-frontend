import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {HomeComponent} from './components/home/home.component';
import {ImpressumComponent} from './components/impressum/impressum.component';
import {HomeGuard} from './guards/home.guard';
import {HOME_ROUTES} from './home.routing';
import {MatDividerModule} from '@angular/material/divider';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    SharedModule.forChild(),
    FormsModule,
    MatDividerModule
  ],
  declarations: [HomeComponent, ImpressumComponent],
  providers:    [HomeGuard] // provide Guards here
})
export class HomeModule {
}
