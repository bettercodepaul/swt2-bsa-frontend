import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterRueckennummerComponent } from './maske1registrierung/register-rueckennummer.component';
import { PasseEingabeComponent } from './maske2eingabe/passe-eingabe.component';
import { WarteBestaetigungComponent } from './maske3aktualisierung/warte-bestaetigung.component';
import { SchusszettelSetupGuard } from './schusszettel-setup.guard';
import { SchusszettelInitComponent } from './setup/schusszettel-init.component';

const routes: Routes = [
  { path: 'setup', component: SchusszettelInitComponent },
  { path: 'registrierung', component: RegisterRueckennummerComponent },
  { path: 'eingabe', component: PasseEingabeComponent, canActivate: [SchusszettelSetupGuard] },
  { path: 'aktualisierung', component: WarteBestaetigungComponent, canActivate: [SchusszettelSetupGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchusszettelRoutingModule {}
