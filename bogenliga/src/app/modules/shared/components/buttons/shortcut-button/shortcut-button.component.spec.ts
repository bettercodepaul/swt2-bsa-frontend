import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutButton } from './shortcut-button.component';

describe('ShortcutButtonComponent', () => {
  let component: ShortcutButton;
  let fixture: ComponentFixture<ShortcutButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortcutButton ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
