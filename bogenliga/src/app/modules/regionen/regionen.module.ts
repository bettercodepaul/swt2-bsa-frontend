import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {REGIONEN_ROUTES} from './regionen.routing';
import {RegionenComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(REGIONEN_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [RegionenComponent]
})
export class RegionenModule {
}
