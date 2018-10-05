import { VerwaltungModule } from './verwaltung.module';

describe('VerwaltungModule', () => {
  let verwaltungModule: VerwaltungModule;

  beforeEach(() => {
    verwaltungModule = new VerwaltungModule();
  });

  it('should create an instance', () => {
    expect(verwaltungModule).toBeTruthy();
  });
});
