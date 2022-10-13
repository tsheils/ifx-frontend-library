import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiseaseService } from "@ncats-frontend-library/stores/disease-store";
import { Apollo } from "apollo-angular";

import { RdasSearchComponent } from './rdas-search.component';

describe('RdasSearchComponent', () => {
  let component: RdasSearchComponent;
  let fixture: ComponentFixture<RdasSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasSearchComponent ],
      providers: [
        DiseaseService,
        Apollo
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
