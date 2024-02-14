import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RdasPrivacyPageComponent } from "features/rdas/privacy-page";

describe('FeaturesRdasPrivacyPageComponent', () => {
  let component: RdasPrivacyPageComponent;
  let fixture: ComponentFixture<RdasPrivacyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdasPrivacyPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasPrivacyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
