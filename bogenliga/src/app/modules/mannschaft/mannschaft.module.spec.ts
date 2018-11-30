import { MannschaftModule } from './mannschaft.module';

describe('MannschaftModule', () => {
  let mannschaftModule: MannschaftModule;

  beforeEach(() => {
    mannschaftModule = new MannschaftModule();
  });

  it('should create an instance', () => {
    expect(mannschaftModule).toBeTruthy();
  });
});
