import { SpotterModule } from './spotter.module';

describe('SpotterModule', () => {
  let spotterModule: SpotterModule;

  beforeEach(() => {
    spotterModule = new SpotterModule();
  });

  it('should create an instance', () => {
    expect(spotterModule).toBeTruthy();
  });
});
