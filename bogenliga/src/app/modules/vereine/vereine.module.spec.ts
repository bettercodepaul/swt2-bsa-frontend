import {VereineModule} from './vereine.module';

describe('VereineModule', () => {
  let vereineModule: VereineModule;

  beforeEach(() => {
    vereineModule = new VereineModule();
  });

  it('should create an instance', () => {
    expect(vereineModule).toBeTruthy();
  });
});
