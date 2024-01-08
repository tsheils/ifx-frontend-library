import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilsFileUploadComponent } from './shared-utils-file-upload.component';

describe('SharedUtilsFileUploadComponent', () => {
  let component: SharedUtilsFileUploadComponent;
  let fixture: ComponentFixture<SharedUtilsFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsFileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
