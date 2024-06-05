
import { TestBed } from '@angular/core/testing';
import { SharedUtilsFileUploadComponent } from "@ncats-frontend-library/shared/utils/file-upload";
import { StoreModule } from "@ngrx/store";
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        SharedUtilsFileUploadComponent,
        StoreModule.forRoot({}),
      ]
      ,
    }).compileComponents();
  });

  it(`should have as title 'adme-loader'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('adme-loader');
  });
});
