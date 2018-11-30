import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared";
import { RouterModule } from "@angular/router";
import { VereineComponent } from "./components/vereine/vereine.component";
import { VEREINE_ROUTES } from "./vereine.routing";
import { MannschaftComponent } from "../mannschaft/components/mannschaft/mannschaft.component"


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VEREINE_ROUTES),
    SharedModule.forChild()
  ],
  declarations: [VereineComponent, MannschaftComponent]
})
export class VereineModule {}
