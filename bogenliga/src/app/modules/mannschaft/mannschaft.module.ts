import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {MANNSCHAFT_ROUTES} from './mannschaft.routing';
import {MannschaftComponent} from './components/mannschaft/mannschaft.component';
import {LigatabelleComponent} from "./components/ligatabelle/ligatabelle.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MANNSCHAFT_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [MannschaftComponent, LigatabelleComponent]
})
export class MannschaftModule {
}
