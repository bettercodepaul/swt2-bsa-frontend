import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {SCHUSSZETTEL_ROUTES} from './schusszettel.routing';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';
import {NumberOnlyDirective} from './components/schusszettel/number.directive';
import {
  RingzahlTabIndexDirective,
  SchuetzenTabIndexDirective
} from './components/schusszettel/tabindex.directive';
import {AutoswitchDirective} from './components/schusszettel/autoswitch.directive';
import {TabletEingabeComponent} from './components/tableteingabe/tableteingabe.component';
import {TabletAdminComponent} from './components/tablet-admin/tablet-admin.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SCHUSSZETTEL_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [
    SchusszettelComponent,
    NumberOnlyDirective,
    RingzahlTabIndexDirective,
    SchuetzenTabIndexDirective,
    AutoswitchDirective,
    TabletEingabeComponent,
    TabletAdminComponent
  ]
})
export class SchusszettelModule {
}
