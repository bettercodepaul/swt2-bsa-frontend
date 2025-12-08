import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {MANNSCHAFTSUEBERSICHT_ROUTES} from './mannschaftsuebersicht.routing';
import {MannschaftsuebersichtComponent} from './components/mannschaftsuebersicht/mannschaftsuebersicht.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MANNSCHAFTSUEBERSICHT_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [MannschaftsuebersichtComponent],
  exports: [MannschaftsuebersichtComponent]
})
export class MannschaftsuebersichtModule {
}
