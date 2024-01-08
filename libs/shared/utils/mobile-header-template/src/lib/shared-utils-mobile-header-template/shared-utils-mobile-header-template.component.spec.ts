import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilsMobileHeaderTemplateComponent } from './shared-utils-mobile-header-template.component';

describe('SharedUtilsMobileHeaderTemplateComponent', () => {
  let component: SharedUtilsMobileHeaderTemplateComponent;
  let fixture: ComponentFixture<SharedUtilsMobileHeaderTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsMobileHeaderTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsMobileHeaderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
