import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchusszettelTabletAdminComponent} from './components/setup/schusszettel-tablet-admin.component';
import {TabletComponent} from './components/tablet/tablet.component';

const routes: Routes = [
  { path: 'wkdurchfuehrung/tablet‐setup‐schusszettel/:wettkampfid',
    component: SchusszettelTabletAdminComponent
  },
  {path: 'tablet', component: TabletComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchusszettelRoutingModule {}
