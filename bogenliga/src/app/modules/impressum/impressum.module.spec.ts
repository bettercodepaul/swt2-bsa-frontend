import { ImpressumModule } from './impressum.module';

describe('ImpressumModule', () => {
  let impressumModule: ImpressumModule;

  beforeEach(() => {
    impressumModule = new ImpressumModule();
  });

  it('should create an instance', () => {
    expect(impressumModule).toBeTruthy();
  });
});
