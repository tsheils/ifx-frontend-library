import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseSubscriptionListComponent } from './disease-subscription-list.component';

describe('DiseaseSubscriptionListComponent', () => {
  let component: DiseaseSubscriptionListComponent;
  let fixture: ComponentFixture<DiseaseSubscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DiseaseSubscriptionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseSubscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
