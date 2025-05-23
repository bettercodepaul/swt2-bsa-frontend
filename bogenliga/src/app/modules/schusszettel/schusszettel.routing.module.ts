import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabletComponent} from './components/tablet/tablet.component';

const routes: Routes = [
  {path: 'tablet', component: TabletComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchusszettelRoutingModule {}
