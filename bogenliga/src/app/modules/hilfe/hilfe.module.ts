import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HilfeComponent } from './components/hilfe/hilfe.component';
import {HILFE_ROUTES} from './hilfe.routing';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {FormsModule} from '@angular/forms';




@NgModule({
  declarations: [HilfeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HILFE_ROUTES),
    SharedModule,
    FormsModule
  ]
})
export class HilfeModule { }
