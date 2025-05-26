import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabletComponent} from './components/tablet/tablet.component';
import {SchusszettelTabletAdminComponent} from '@schusszettel/components/setup/schusszettel-tablet-admin.component';

/**
 * Routing for the Schusszettel feature module.
 */
const routes: Routes = [
  /**
   * Tablet entry point: teams scan QR codes to access this with token, teamid, wettkampfid
   * Example: /schusszettel/tablet?token=...&teamid=...&wettkampfid=...
   */
  { path: 'tablet', component: TabletComponent },

  /**
   * Neustart / Admin setup for schusszettel per Wettkampf
   * Example: /schusszettel/tablet-setup/:wettkampfId
   */
  { path: 'tablet-setup/:wettkampfId', component: SchusszettelTabletAdminComponent },

  /**
   * Default within this module redirects to tablet entry with an error (since no parameters)
   */
  { path: '', redirectTo: 'tablet', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchusszettelRoutingModule {}
