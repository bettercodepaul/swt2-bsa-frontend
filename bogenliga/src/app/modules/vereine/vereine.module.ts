import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';
import {VereineMannschaftenComponent} from './components/mannschaften/vereine-mannschaften.component';
import {VereineDataTableComponent} from './components/vereine-data-table/vereine-data-table.component';
import {VereineTableComponent} from './components/vereine-table/vereine-table.component';
import {VereineComponent} from './components/vereine/vereine.component';
import {VEREINE_ROUTES} from './vereine.routing';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VEREINE_ROUTES),
    SharedModule.forChild()
  ],
  exports: [RouterModule, SharedModule],
  declarations: [VereineComponent,
                VereineMannschaftenComponent,
                VereineTableComponent,
                VereineDataTableComponent]
})
export class VereineModule { }
