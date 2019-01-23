import { TestBed } from '@angular/core/testing';

import { LigaDataProviderService } from './liga-data-provider.service';

describe('LigaDataProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LigaDataProviderService = TestBed.get(LigaDataProviderService);
    expect(service).toBeTruthy();
  });
});
