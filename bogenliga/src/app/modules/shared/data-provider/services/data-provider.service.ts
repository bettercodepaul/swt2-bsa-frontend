import {DataServiceConfig} from '../../../settings/types/data-service-config.interface';
import {UriBuilder} from './utils/uri-builder.class';
import {environment} from '../../../../../environments/environment';

export abstract class DataProviderService {
  abstract serviceSubUrl: string;
  dataServiceConfig: DataServiceConfig;

  constructor() {
    this.dataServiceConfig = {
      baseUrl: environment.backendBaseUrl
    };
  }

  /**
   * return <BASE_URL>/<SERVICE_SUB_URL>
   */
  getUrl(): string {
    return new UriBuilder()
      .fromPath(this.dataServiceConfig.baseUrl)
      .path(this.serviceSubUrl)
      .build();
  }
}


