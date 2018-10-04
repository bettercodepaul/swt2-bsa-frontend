import {DataServiceConfig} from '../../../settings/types/data-service-config.interface';
import {UriBuilder} from './utils/uri-builder.class';

export abstract class DataProviderService {
  abstract serviceSubUrl: string;
  dataServiceConfig: DataServiceConfig;

  constructor() {
    this.dataServiceConfig = {
      baseUrl: 'http://localhost:9000'
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


