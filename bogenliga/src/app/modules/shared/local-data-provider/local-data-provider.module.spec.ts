import {LocalDataProviderModule} from './local-data-provider.module';

describe('LocalDataProviderModule', () => {
  let localDataProviderModule: LocalDataProviderModule;

  beforeEach(() => {
    localDataProviderModule = new LocalDataProviderModule();
  });

  it('should create an instance', () => {
    expect(localDataProviderModule).toBeTruthy();
  });
});
