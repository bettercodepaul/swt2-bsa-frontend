import { TestBed } from '@angular/core/testing';

import { WettkampfklassenDataProviderService } from './wettkampfklassen-data-provider.service';

describe('WettkampfklassenDataProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WettkampfklassenDataProviderService = TestBed.get(WettkampfklassenDataProviderService);
    expect(service).toBeTruthy();
  });
});
