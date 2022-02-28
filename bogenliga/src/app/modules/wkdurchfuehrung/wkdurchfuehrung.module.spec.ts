import {WkdurchfuehrungModule} from './wkdurchfuehrung.module';

describe('wkdurchfuehrungModule', () => {
  let wkdurchfuehrungModule: WkdurchfuehrungModule;

  beforeEach(() => {
    wkdurchfuehrungModule = new WkdurchfuehrungModule();
  });

  it('should create an instance', () => {
    expect(wkdurchfuehrungModule).toBeTruthy();
  });
});
