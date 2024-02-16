import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DISEASES_FEATURE_KEY,
  reducer,
} from '@ncats-frontend-library/stores/disease-store';
import { StoreModule } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

import { RdasBrowseComponent } from './rdas-browse.component';

describe('RdasBrowseComponent', () => {
  let component: RdasBrowseComponent;
  let fixture: ComponentFixture<RdasBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        RdasBrowseComponent,
        BrowserAnimationsModule,
        StoreModule,
      ],
      providers: [

      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
