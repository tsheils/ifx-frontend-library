import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { DiseasesFacade } from '@ncats-frontend-library/stores/disease-store';
import { UsersFacade } from '@ncats-frontend-library/stores/user-store';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [AppComponent, RouterModule],
      providers: [
        { provide: DiseasesFacade, useValue: {} },
        { provide: UsersFacade, useValue: {} },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'rdas'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('rdas');
  });
});
