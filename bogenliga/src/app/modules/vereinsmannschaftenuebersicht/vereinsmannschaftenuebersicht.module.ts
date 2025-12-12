import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {MANNSCHAFTSUEBERSICHT_ROUTES} from './vereinsmannschaftenuebersicht.routing';
import {VereinsmannschaftenuebersichtComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MANNSCHAFTSUEBERSICHT_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VereinsmannschaftenuebersichtComponent],
  exports: [VereinsmannschaftenuebersichtComponent]
})
export class VereinsmannschaftenuebersichtModule {
}
