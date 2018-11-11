import { TestBed, async, inject } from '@angular/core/testing';

import { WettkampfklasseOverviewGuard } from './wettkampfklasse-overview.guard';

describe('WettkampfklasseOverviewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WettkampfklasseOverviewGuard]
    });
  });

  it('should ...', inject([WettkampfklasseOverviewGuard], (guard: WettkampfklasseOverviewGuard) => {
    expect(guard).toBeTruthy();
  }));
});
