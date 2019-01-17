import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {
  AlertComponent,
  BreadcrumbsComponent,
  ButtonComponent,
  CenteredLayoutComponent,
  ColLayoutComponent,
  CommonDialogComponent,
  DataTableComponent,
  DetailDialogComponent,
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
  TableEmptyPlaceholderComponent,
  TableLoadingPlaceholderComponent,
  TooltipComponent
} from './components';
import {RestClient} from './data-provider';
import * as SharedService from './services';
import * as LocalDataProvider from './local-data-provider/services';
import {StorageServiceModule} from 'angular-webstorage-service';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';
import {TruncationPipe} from './pipes';
import {NavigationCardsComponent} from './components/navigation-cards';

/*
 * define font awesome icon libraries
 */
library.add(fas, far, fab); // add all icon types


@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forChild(),
    RouterModule,
    FontAwesomeModule,
    StorageServiceModule
  ],
  exports:      [
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
    TooltipComponent,
    DropdownMenuComponent,
    SelectionlistComponent,
    QuicksearchListComponent,
    DownloadButtonComponent
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
    TooltipComponent,
    DropdownMenuComponent,
    SelectionlistComponent,
    QuicksearchListComponent,
    DownloadButtonComponent
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule:  SharedModule,
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

  static forChild(): ModuleWithProviders {
    return {
      ngModule:  SharedModule,
      providers: []
    };
  }
}
