import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';
import {VereineComponent} from './components/vereine/vereine.component';
import {VEREINE_ROUTES} from './vereine.routing';
import {VereineMannschaftenComponent} from "./components/mannschaften/vereine-mannschaften.component";



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VEREINE_ROUTES),
    SharedModule.forChild()
  ],
  exports:[RouterModule, SharedModule],
  declarations: [VereineComponent, VereineMannschaftenComponent]
})
export class VereineModule { }
