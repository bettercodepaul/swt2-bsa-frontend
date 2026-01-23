import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {VEREINE_ROUTES} from './vereine.routing';
import {VereineComponent, VereinComponent, MannschaftComponent, MannschaftTableComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VEREINE_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VereineComponent, VereinComponent, MannschaftComponent, MannschaftTableComponent]
})
export class VereineModule {
}
