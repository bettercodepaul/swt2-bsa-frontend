import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { SPOTTER_ROUTES } from './spotter.routing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { InterfaceGuard, AuthenticationGuard} from './guards';

import { InterfaceComponent, AuthenticationComponent } from './components';

@NgModule({
  declarations: [InterfaceComponent, AuthenticationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SPOTTER_ROUTES),
    SharedModule.forChild(),
    FormsModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    InterfaceGuard,
    AuthenticationGuard
  ]

})
export class SpotterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthenticationGuard,
        InterfaceGuard
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
