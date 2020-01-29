import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {LigatabelleComponent} from './components/ligatabelle/ligatabelle.component';
import {LigatabelleGuard} from './guards/ligatabelle.guard';
import {LIGATABELLE_ROUTES} from './ligatabelle.routing';


@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(LIGATABELLE_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [LigatabelleComponent],
  providers:    [LigatabelleGuard]
})
export class LigatabelleModule {
}
