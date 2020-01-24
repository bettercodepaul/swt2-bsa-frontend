
import {Routes} from '@angular/router';

import { InterfaceComponent } from './components/interface/interface.component';
import { InterfaceGuard } from './guards/interface.guard';




import {AuthenticationComponent} from './components';
import {AuthenticationGuard} from './guards';

export const SPOTTER_ROUTES: Routes = [
    {path: '', component: InterfaceComponent, canActivate: [InterfaceGuard]},
    {path: 'authentication', component: AuthenticationComponent, canActivate: [AuthenticationGuard]}
];

