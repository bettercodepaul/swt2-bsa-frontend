import { TestBed } from '@angular/core/testing';

import { WettkampfdataService } from './wettkampfdata.service';

describe('WettkampfdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WettkampfdataService = TestBed.get(WettkampfdataService);
    expect(service).toBeTruthy();
  });
});
