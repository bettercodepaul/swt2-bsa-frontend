import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilnemendeManschaftenTabelleComponent } from './teilnemende-manschaften-tabelle.component';

describe('TeilnemendeManschaftenTabelleComponent', () => {
  let component: TeilnemendeManschaftenTabelleComponent;
  let fixture: ComponentFixture<TeilnemendeManschaftenTabelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeilnemendeManschaftenTabelleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeilnemendeManschaftenTabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
