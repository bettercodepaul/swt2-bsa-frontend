import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Maske1RegistrierungComponent } from './maske1registrierung/maske1registrierung.component';
import { Maske2EingabeComponent } from './maske2eingabe/maske2eingabe.component';
import { Maske3AktualisierungComponent } from './maske3aktualisierung/maske3aktualisierung.component';

const routes: Routes = [
  { path: 'schusszettel/registrierung', component: Maske1RegistrierungComponent },
  { path: 'schusszettel/eingabe', component: Maske2EingabeComponent },
  { path: 'schusszettel/aktualisierung', component: Maske3AktualisierungComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchusszettelRoutingModule { }
