import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {HOME_ROUTES} from './home.routing';
import {FormsModule} from '@angular/forms';
import {HomeComponent} from './components/home/home.component';
import {HomeGuard} from './guards/home.guard';


@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [HomeComponent],
  providers:    [HomeGuard] // provide Guards here
})
export class HomeModule {
}
