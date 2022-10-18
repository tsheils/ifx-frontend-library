import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedRdasRdasSearchModule } from "@ncats-frontend-library/shared/rdas/rdas-search";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { reducer, DISEASES_FEATURE_KEY } from "@ncats-frontend-library/stores/disease-store";
import { StoreModule } from "@ngrx/store";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { RdasHomeComponent } from './rdas-home.component';

describe('RdasHomeComponent', () => {
  let component: RdasHomeComponent;
  let fixture: ComponentFixture<RdasHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasHomeComponent ],
      imports: [
        BrowserAnimationsModule,
        SharedRdasRdasSearchModule,
        ApolloTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, reducer)
      ],
      providers: [
        Apollo,
        DiseasesFacade,
  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
