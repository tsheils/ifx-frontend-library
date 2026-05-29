import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ProjectEffects,
  PROJECTS_FEATURE_KEY,
  projectsReducer,
} from 'project-store';
import { StoreModule } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { RdasProjectPageComponent } from './rdas-project-page.component';

describe('RdasProjectPageComponent', () => {
  let component: RdasProjectPageComponent;
  let fixture: ComponentFixture<RdasProjectPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RdasProjectPageComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(PROJECTS_FEATURE_KEY, projectsReducer),
      ],
      providers: [provideStoreDevtools({ maxAge: 25, logOnly: false })],
    });
    fixture = TestBed.createComponent(RdasProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
