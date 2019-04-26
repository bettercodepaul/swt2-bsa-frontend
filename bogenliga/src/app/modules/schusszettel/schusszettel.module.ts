import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {SCHUSSZETTEL_ROUTES} from './schusszettel.routing';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SCHUSSZETTEL_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [SchusszettelComponent]
})
export class SchusszettelModule {
}
