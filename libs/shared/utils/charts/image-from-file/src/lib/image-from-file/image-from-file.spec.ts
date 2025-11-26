import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageFromFile } from './image-from-file';

describe('ImageFromFile', () => {
  let component: ImageFromFile;
  let fixture: ComponentFixture<ImageFromFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageFromFile],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageFromFile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
