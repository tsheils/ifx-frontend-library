import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  DISEASES_FEATURE_KEY,
  diseasesReducer,
} from '@ncats-frontend-library/stores/disease-store'
import { StoreModule } from '@ngrx/store'
import { GeneListComponent } from './gene-list.component'

describe('GeneListComponent', () => {
  let component: GeneListComponent
  let fixture: ComponentFixture<GeneListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GeneListComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(GeneListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
