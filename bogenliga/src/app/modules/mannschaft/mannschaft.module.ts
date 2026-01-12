import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {MANNSCHAFTSUEBERSICHT_ROUTES} from './mannschaft.routing';
import {MannschaftComponent, MannschaftTextComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MANNSCHAFTSUEBERSICHT_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [MannschaftComponent, MannschaftTextComponent],
  exports: [MannschaftComponent, MannschaftTextComponent]
})
export class MannschaftModule {
}
