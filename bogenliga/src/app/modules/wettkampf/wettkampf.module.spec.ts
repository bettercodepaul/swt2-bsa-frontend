import { WettkampfModule } from './wettkampf.module';

describe('SettingsModule', () => {
  let wettkampfModule: WettkampfModule;

  beforeEach(() => {
    wettkampfModule = new WettkampfModule();
  });

  it('should create an instance', () => {
    expect(wettkampfModule).toBeTruthy();
  });
});
