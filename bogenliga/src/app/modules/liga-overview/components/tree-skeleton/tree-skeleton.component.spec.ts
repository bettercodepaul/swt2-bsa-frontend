import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TreeSkeletonComponent } from './tree-skeleton.component';

describe('TreeSkeletonComponent', () => {
  let component: TreeSkeletonComponent;
  let fixture: ComponentFixture<TreeSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeSkeletonComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render skeleton container with status role', () => {
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.tree-skeleton');
    expect(container).toBeTruthy();
    expect(container.getAttribute('role')).toBe('status');
  });

  it('should include sr-only loading text', () => {
    fixture.detectChanges();

    const srOnly = fixture.nativeElement.querySelector('.sr-only');
    expect(srOnly).toBeTruthy();
  });
});
