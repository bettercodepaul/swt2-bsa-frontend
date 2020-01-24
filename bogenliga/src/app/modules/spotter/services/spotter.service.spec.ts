/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpotterService } from './spotter.service';

describe('Service: Spotter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpotterService]
    });
  });

  it('should ...', inject([SpotterService], (service: SpotterService) => {
    expect(service).toBeTruthy();
  }));
});
