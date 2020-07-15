import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
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
  RowLayoutComponent,
  SelectionlistComponent,
  SimpleOverviewDialogComponent,
  TableEmptyPlaceholderComponent,
  TableLoadingPlaceholderComponent,
  TooltipComponent
} from './components';
import {RestClient} from './data-provider';
import * as LocalDataProvider from './local-data-provider/services';
import * as SharedService from './services';

import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NavigationCardsComponent} from './components/navigation-cards';
import {TruncationPipe} from './pipes';
import {SetzlisteDownloadComponent} from '@shared/components/buttons/setzliste-download/setzliste-download.component';
import {BogenkontrolllisteDownloadComponent} from '@shared/components/buttons/bogenkontrollliste-download/bogenkontrollliste-download.component';
import {SchusszettelDownloadComponent} from '@shared/components/buttons/schusszettel-download/schusszettel-download.component';
import {MeldezettelDownloadComponent} from '@shared/components/buttons/meldezettel-download/meldezettel-download.component';
import {StorageServiceModule} from 'ngx-webstorage-service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forChild(),
    RouterModule,
    FontAwesomeModule,
    StorageServiceModule
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
    DownloadButtonComponent,
    SimpleOverviewDialogComponent,
    DoubleSelectionlistComponent,
    BogenkontrolllisteDownloadComponent,
    SetzlisteDownloadComponent,
    SchusszettelDownloadComponent,
    MeldezettelDownloadComponent,

  ],
  declarations: [
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
    DownloadButtonComponent,
    DoubleSelectionlistComponent,
    BogenkontrolllisteDownloadComponent,
    SchusszettelDownloadComponent,
    SetzlisteDownloadComponent,
    MeldezettelDownloadComponent,
  ]
})
export class SharedModule {

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
