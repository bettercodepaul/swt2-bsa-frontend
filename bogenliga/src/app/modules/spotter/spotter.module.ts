import { CommonModule } from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import { SPOTTER_ROUTES } from './spotter.routing';

import {WettkaempfeGuard, MatchesGuard, BahnenGuard, SchuetzenGuard, AuthenticationGuard} from './guards';

import {
  WettkaempfeComponent,
  MatchesComponent,
  BahnenComponent,
  SchuetzenComponent,
  AuthenticationComponent
} from './components';

@NgModule({
  declarations: [AuthenticationComponent, WettkaempfeComponent, MatchesComponent, BahnenComponent, SchuetzenComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SPOTTER_ROUTES),
    SharedModule.forChild(),
    FormsModule
  ],
  providers: [
    AuthenticationGuard,
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
        AuthenticationGuard,
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
