import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {SportjahresplanComponent} from './components/sportjahresplan/sportjahresplan.component';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';
import {NumberOnlyDirective} from './/components/schusszettel/number.directive';
import {RingzahlTabIndexDirective, SchuetzenTabIndexDirective} from './components/schusszettel/tabindex.directive';
import {AutoswitchDirective} from './components/schusszettel/autoswitch.directive';
import {TabletEingabeComponent} from './components/tableteingabe/tableteingabe.component';
import {TabletAdminComponent} from './components/tablet-admin/tablet-admin.component';
import {SportjahresplanGuard} from './guards/sportjahresplan.guard';
import {SPORTJAHRESPLAN_ROUTES} from './sportjahresplan.routing';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(SPORTJAHRESPLAN_ROUTES),
    SharedModule,
    FormsModule

  ],
  declarations: [
    SportjahresplanComponent,
    SchusszettelComponent,
    NumberOnlyDirective,
    RingzahlTabIndexDirective,
    SchuetzenTabIndexDirective,
    AutoswitchDirective,
    TabletEingabeComponent,
    TabletAdminComponent
  ],
  providers:    [SportjahresplanGuard]
})
export class SportjahresplanModule {
}


