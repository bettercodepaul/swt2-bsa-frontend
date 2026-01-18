import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorStateComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show retry button by default and emit retry on click', () => {
    spyOn(component.retry, 'emit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.error-state__retry-btn');
    expect(button).toBeTruthy();

    button.click();
    expect(component.retry.emit).toHaveBeenCalled();
  });

  it('should hide retry button when showRetry is false', () => {
    component.showRetry = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.error-state__retry-btn');
    expect(button).toBeNull();
  });
});
