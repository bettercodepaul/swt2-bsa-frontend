import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterRueckennummerComponent } from './maske1registrierung/register-rueckennummer.component';
import { PasseEingabeComponent } from './maske2eingabe/passe-eingabe.component';
import { WarteBestaetigungComponent } from './maske3aktualisierung/warte-bestaetigung.component';
import { SchusszettelSetupGuard } from './schusszettel-setup.guard';
import { SchusszettelInitComponent } from './setup/schusszettel-init.component';
import { SchusszettelTabletAdminComponent } from './setup/schusszettel-tablet-admin.component';
import { WettkampfleiterTabletViewComponent } from './wettkampfleiter-tablet-view/wettkampfleiter-tablet-view.component';

const routes: Routes = [
  { path: 'setup', component: SchusszettelInitComponent },
  { path: 'registrierung', component: RegisterRueckennummerComponent },
  { path: 'eingabe', component: PasseEingabeComponent, canActivate: [SchusszettelSetupGuard] },
  { path: 'aktualisierung', component: WarteBestaetigungComponent, canActivate: [SchusszettelSetupGuard] },
  {path: 'wettkampfleiter-tablet-view', component: WettkampfleiterTabletViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchusszettelRoutingModule {}
