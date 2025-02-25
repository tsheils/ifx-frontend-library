import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MobileHeaderTemplateComponent } from './shared-utils-mobile-header-template.component';

describe('MobileHeaderTemplateComponent', () => {
  let component: MobileHeaderTemplateComponent;
  let fixture: ComponentFixture<MobileHeaderTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MobileHeaderTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileHeaderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
