import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageServiceModule} from 'angular-webstorage-service';
import {LocalDataProviderService} from './services/local-data-provider.service';
import {SessionStorageDataProvider} from './services/data-sources/session-storage-data-provider.class';
import {LocalStorageDataProvider} from './services/data-sources/local-storage-data-provider.class';

@NgModule({
  imports: [
    CommonModule,
    StorageServiceModule
  ],
  declarations: []
})
export class LocalDataProviderModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocalDataProviderModule,
      providers: [LocalDataProviderService, SessionStorageDataProvider, LocalStorageDataProvider]
    };
  }
}
