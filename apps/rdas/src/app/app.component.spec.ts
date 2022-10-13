import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from "@angular/router";
import { SharedUtilsHeaderTemplateModule } from "@ncats-frontend-library/shared/utils/header-template";
import { SharedUtilsLoadingSpinnerModule } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { SharedSocialSignOnModule } from "@ncats-frontend-library/shared/utils/social-sign-on";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        SharedUtilsHeaderTemplateModule,
        SharedSocialSignOnModule,
        SharedUtilsLoadingSpinnerModule,
        RouterModule
      ],
      providers: [
        {provide: DiseasesFacade, useValue: {}},
        {provide: UsersFacade, useValue: {}},
        {provide: ActivatedRoute, useValue: {}}
      ]
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
