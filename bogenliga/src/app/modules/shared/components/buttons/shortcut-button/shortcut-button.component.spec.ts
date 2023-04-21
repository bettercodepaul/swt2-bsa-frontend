import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutButtonComponent } from './shortcut-button.component';

describe('ShortcutButtonComponent', () => {
  let component: ShortcutButtonComponent;
  let fixture: ComponentFixture<ShortcutButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortcutButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
