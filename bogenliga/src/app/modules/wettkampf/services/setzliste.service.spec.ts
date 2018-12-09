import { TestBed } from '@angular/core/testing';

import { SetzlisteDataProviderService } from './setzliste-data-provider.service';

describe('SetzlisteDataProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetzlisteDataProviderService = TestBed.get(SetzlisteDataProviderService);
    expect(service).toBeTruthy();
  });
});
