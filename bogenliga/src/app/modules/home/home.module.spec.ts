import { SettingsModule } from './home.module';

describe('SettingsModule', () => {
  let settingsModule: SettingsModule;

  beforeEach(() => {
    settingsModule = new SettingsModule();
  });

  it('should create an instance', () => {
    expect(settingsModule).toBeTruthy();
  });
});
