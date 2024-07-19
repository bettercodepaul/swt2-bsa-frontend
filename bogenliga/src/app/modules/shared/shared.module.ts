import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
  ExpandComponent,
  AlertComponent,
  BreadcrumbsComponent,
  ButtonComponent,
  CenteredLayoutComponent,
  ColLayoutComponent,
  CommonDialogComponent,
  DataTableComponent,
  DetailDialogComponent,
  DoubleSelectionlistComponent,
  DownloadButtonComponent,
  DropdownMenuComponent,
  GridLayoutComponent,
  HorizontalFormComponent,
  ModalDialogComponent,
  NavigationDialogComponent,
  OverviewDialogComponent,
  PageHeadingComponent,
  QuicksearchListComponent,
  QuicksearchComponent,
  RowLayoutComponent,
  SelectionlistComponent,
  SimpleOverviewDialogComponent,
  TableEmptyPlaceholderComponent,
  TableLoadingPlaceholderComponent,
  TooltipComponent,
} from './components';
import {RestClient} from './data-provider';
import * as LocalDataProvider from './local-data-provider/services';
import * as SharedService from './services';

import {RouterModule} from '@angular/router';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NavigationCardsComponent} from './components/navigation-cards';
import {TruncationPipe} from './pipes';
import {SetzlisteDownloadComponent} from '@shared/components/buttons/setzliste-download/setzliste-download.component';
import {BogenkontrolllisteDownloadComponent} from '@shared/components/buttons/bogenkontrollliste-download/bogenkontrollliste-download.component';
import {SchusszettelDownloadComponent} from '@shared/components/buttons/schusszettel-download/schusszettel-download.component';
import {MeldezettelDownloadComponent} from '@shared/components/buttons/meldezettel-download/meldezettel-download.component';
import {OverviewSelectionDialogComponent} from '@shared/components/dialogs/overview-selection-dialog/overview-selection-dialog.component';
import {EinzelstatistikDownloadComponent} from '@shared/components/buttons/einzelstatistik-download/einzelstatistik-download.component';
import {GesamtstatistikDownloadComponent} from '@shared/components/buttons/gesamtstatistik-download/gesamtstatistik-download.component';
import {TagesuebersichtDownloadComponent} from '@shared/components/buttons/tagesuebersicht-download/tagesuebersicht-download-component';

import {StorageServiceModule} from 'ngx-webstorage-service';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {HilfeButtonComponent} from '@shared/components/buttons/hilfe-button/hilfe-button.component';
import {ActionButtonComponent} from '@shared/components/buttons/button/actionbutton.component';
import {
  DownloadActionButtonComponent
} from '@shared/components/buttons/download-button/download-actionbutton.component';
import { ShortcutButton } from './components/buttons/shortcut-button/shortcut-button.component';
import {
  VeranstaltungenButtonComponent
} from '@shared/components/buttons/veranstaltungen-button/veranstaltungen-button.component';
import {StatusbarComponent} from '@shared/components/statusbars';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FilterinputbarComponent} from '@shared/components/selectionlists/filterinputbar/filterinputbar.component';
import {
  FilterTimestampInputbarComponent
} from '@shared/components/selectionlists/filterTimestampInputbar/filterTimestampInputbar.component';
import {PageNumberDisplayComponent} from '@shared/components/displays/pagenumber-display/pagenumber-display.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forChild(),
    RouterModule,
    FontAwesomeModule,
    StorageServiceModule,
    MatProgressBarModule,
  ],
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ButtonComponent,
    AlertComponent,
    ModalDialogComponent,
    PageHeadingComponent,
    BreadcrumbsComponent,
    OverviewDialogComponent,
    CommonDialogComponent,
    DetailDialogComponent,
    DataTableComponent,
    TableEmptyPlaceholderComponent,
    TableLoadingPlaceholderComponent,
    TruncationPipe,
    HorizontalFormComponent,
    CenteredLayoutComponent,
    ColLayoutComponent,
    GridLayoutComponent,
    RowLayoutComponent,
    NavigationCardsComponent,
    NavigationDialogComponent,
    NavigationDialogComponent,
    TooltipComponent,
    DropdownMenuComponent,
    SelectionlistComponent,
    QuicksearchListComponent,
    QuicksearchComponent,
    FilterinputbarComponent,
    FilterTimestampInputbarComponent,
    DownloadButtonComponent,
    SimpleOverviewDialogComponent,
    DoubleSelectionlistComponent,
    BogenkontrolllisteDownloadComponent,
    SetzlisteDownloadComponent,
    SchusszettelDownloadComponent,
    MeldezettelDownloadComponent,
    OverviewSelectionDialogComponent,
    EinzelstatistikDownloadComponent,
    GesamtstatistikDownloadComponent,
    TagesuebersichtDownloadComponent,
    HilfeButtonComponent,
    ActionButtonComponent,
    DownloadActionButtonComponent,
    ShortcutButton,
    VeranstaltungenButtonComponent,
    ExpandComponent,
    StatusbarComponent,
    PageNumberDisplayComponent,
  ],
  declarations: [
    ExpandComponent,
    ButtonComponent,
    AlertComponent,
    ModalDialogComponent,
    PageHeadingComponent,
    BreadcrumbsComponent,
    OverviewDialogComponent,
    CommonDialogComponent,
    DetailDialogComponent,
    DataTableComponent,
    TableEmptyPlaceholderComponent,
    TableLoadingPlaceholderComponent,
    TruncationPipe,
    HorizontalFormComponent,
    CenteredLayoutComponent,
    ColLayoutComponent,
    GridLayoutComponent,
    RowLayoutComponent,
    NavigationCardsComponent,
    NavigationDialogComponent,
    SimpleOverviewDialogComponent,
    TooltipComponent,
    DropdownMenuComponent,
    SelectionlistComponent,
    QuicksearchListComponent,
    QuicksearchComponent,
    FilterinputbarComponent,
    FilterTimestampInputbarComponent,
    DownloadButtonComponent,
    DoubleSelectionlistComponent,
    BogenkontrolllisteDownloadComponent,
    SchusszettelDownloadComponent,
    SetzlisteDownloadComponent,
    MeldezettelDownloadComponent,
    OverviewSelectionDialogComponent,
    EinzelstatistikDownloadComponent,
    GesamtstatistikDownloadComponent,
    TagesuebersichtDownloadComponent,
    HilfeButtonComponent,
    ActionButtonComponent,
    DownloadActionButtonComponent,
    ShortcutButton,
    VeranstaltungenButtonComponent,
    StatusbarComponent,
    PageNumberDisplayComponent
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add multiple icons to the library
    library.addIconPacks(fas, far, fab);
  }

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        SharedService.CurrentUserService,
        SharedService.ErrorHandlingService,
        SharedService.NotificationService,
        LocalDataProvider.LocalDataProviderService,
        LocalDataProvider.LocalStorageDataProvider,
        LocalDataProvider.SessionStorageDataProvider,
        SharedService.OnOfflineService,
        RestClient
      ]
    };
  }

  static forChild(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
