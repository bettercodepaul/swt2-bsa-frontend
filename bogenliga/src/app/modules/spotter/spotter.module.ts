import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { SPOTTER_ROUTES } from './spotter.routing';

import {
  LoginGuard,
  InterfaceGuard,
} from './guards';

import { LoginComponent } from './components/login/login.component';
import { InterfaceComponent } from './components/interface/interface.component';

@NgModule({
  declarations: [LoginComponent, InterfaceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SPOTTER_ROUTES),
    SharedModule.forChild(),
    FormsModule
  ],
  providers: [LoginGuard, InterfaceGuard]
})
export class SpotterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [LoginGuard, InterfaceGuard]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
