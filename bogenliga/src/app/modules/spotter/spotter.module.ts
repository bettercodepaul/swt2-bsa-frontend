import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { SPOTTER_ROUTES } from './spotter.routing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { InterfaceGuard} from './guards';

import { InterfaceComponent } from './components/interface/interface.component';

@NgModule({
  declarations: [InterfaceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SPOTTER_ROUTES),
    SharedModule.forChild(),
    FormsModule,
    FontAwesomeModule
  ],
  providers: [InterfaceGuard]
})
export class SpotterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [InterfaceGuard]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
