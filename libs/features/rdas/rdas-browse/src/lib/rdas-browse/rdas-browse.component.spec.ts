import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedRdasDiseaseDisplayModule } from "@ncats-frontend-library/shared/rdas/disease-display";
import { DISEASES_FEATURE_KEY, DiseasesFacade, reducer } from "@ncats-frontend-library/stores/disease-store";
import { StoreModule } from "@ngrx/store";
import { Apollo } from "apollo-angular";

import { RdasBrowseComponent } from './rdas-browse.component';

describe('RdasBrowseComponent', () => {
  let component: RdasBrowseComponent;
  let fixture: ComponentFixture<RdasBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasBrowseComponent ],
      imports: [
        BrowserAnimationsModule,
        SharedRdasDiseaseDisplayModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, reducer)
      ],
      providers: [
        Apollo,
        DiseasesFacade
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
