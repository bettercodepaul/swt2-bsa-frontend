import { NgModule } from "@angular/core";
import { SharedModule } from "../shared";
import { CommonModule } from "@angular/common";
import { MannschaftComponent } from "./components/mannschaft/mannschaft.component";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [MannschaftComponent]
})
export class MannschaftModule {}
