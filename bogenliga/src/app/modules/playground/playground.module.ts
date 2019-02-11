import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as PlaygroundComponents from './components/playground/components';
import {PlaygroundComponent} from './components/playground/playground.component';
import {SharedModule} from '../shared';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';
import {PLAYGROUND_ROUTES} from './playground.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PLAYGROUND_ROUTES),
    SharedModule,
    FontAwesomeModule
  ],
  declarations: [
    PlaygroundComponents.TooltipExampleComponent,
/*    PlaygroundComponents.DropdownMenuExampleComponent,
    PlaygroundComponents.SelectionlistExampleComponent,
    PlaygroundComponents.LayoutExampleComponent,*/
    PlaygroundComponents.DownloadFileExampleComponent,
    PlaygroundComponent,
  ]
})
export class PlaygroundModule {
}
