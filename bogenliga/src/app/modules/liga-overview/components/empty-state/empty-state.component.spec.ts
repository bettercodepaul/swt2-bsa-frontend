import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyStateComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render default icon class', () => {
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.empty-state__icon');
    expect(icon.classList.contains('fa-folder-open')).toBe(true);
  });

  it('should render custom icon class', () => {
    component.icon = 'fa-star';
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.empty-state__icon');
    expect(icon.classList.contains('fa-star')).toBe(true);
  });
});
