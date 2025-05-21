import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchusszettelTabletAdminComponent} from './setup/schusszettel-tablet-admin.component';
import {TabletComponent} from './tablet/tablet.component';

const routes: Routes = [
  {path: 'wettkampfleiter-tablet-view/:id', component: SchusszettelTabletAdminComponent},
  {path: 'tablet', component: TabletComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchusszettelRoutingModule {}
