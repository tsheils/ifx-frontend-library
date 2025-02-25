import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ProjectEffects,
  PROJECTS_FEATURE_KEY,
  projectsReducer,
} from '@ncats-frontend-library/stores/grant-store';
import { StoreModule } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { RdasGrantPageComponent } from './rdas-grant-page.component';

describe('RdasGrantPageComponent', () => {
  let component: RdasGrantPageComponent;
  let fixture: ComponentFixture<RdasGrantPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RdasGrantPageComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(PROJECTS_FEATURE_KEY, projectsReducer),
      ],
      providers: [provideStoreDevtools({ maxAge: 25, logOnly: false })],
    });
    fixture = TestBed.createComponent(RdasGrantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
