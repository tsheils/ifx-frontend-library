import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationsDisplayComponent } from './annotations-display.component';

describe('AnnotationsDisplayComponent', () => {
  let component: AnnotationsDisplayComponent;
  let fixture: ComponentFixture<AnnotationsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationsDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationsDisplayComponent);
    component = fixture.componentInstance;
   // component.annotations = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
