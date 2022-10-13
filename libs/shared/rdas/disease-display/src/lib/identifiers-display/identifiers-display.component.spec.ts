import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiseaseHeaderComponent, DiseaseListCardComponent } from "@ncats-frontend-library/shared/rdas/disease-display";
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";

import { IdentifiersDisplayComponent } from './identifiers-display.component';

describe('IdentifiersDisplayComponent', () => {
  let component: IdentifiersDisplayComponent;
  let fixture: ComponentFixture<IdentifiersDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifiersDisplayComponent, DiseaseHeaderComponent ],
      imports: [
        SharedRdasSubscribeButtonModule,
        DiseaseListCardComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentifiersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
