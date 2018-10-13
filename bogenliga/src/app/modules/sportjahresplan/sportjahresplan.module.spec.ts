import {SportjahresplanModule} from './sportjahresplan.module';

describe('SportjahresplanModule', () => {
  let sportjahresplanModule: SportjahresplanModule;

  beforeEach(() => {
    sportjahresplanModule = new SportjahresplanModule();
  });

  it('should create an instance', () => {
    expect(sportjahresplanModule).toBeTruthy();
  });
});
