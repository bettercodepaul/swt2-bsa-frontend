import { CommonModule } from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import { SPOTTER_ROUTES } from './spotter.routing';

import {WettkaempfeGuard, MatchesGuard, BahnenGuard, SchuetzenGuard} from './guards';

import {WettkaempfeComponent, MatchesComponent, BahnenComponent, SchuetzenComponent} from './components';

@NgModule({
  declarations: [WettkaempfeComponent, MatchesComponent, BahnenComponent, SchuetzenComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SPOTTER_ROUTES),
    SharedModule.forChild(),
    FormsModule
  ],
  providers: [
    WettkaempfeGuard,
    MatchesGuard,
    BahnenGuard,
    SchuetzenGuard
  ]

})
export class SpotterModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        WettkaempfeGuard,
        MatchesGuard,
        BahnenGuard,
        SchuetzenGuard
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }

}
