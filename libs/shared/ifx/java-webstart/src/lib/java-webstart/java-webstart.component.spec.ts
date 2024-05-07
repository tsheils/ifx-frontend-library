import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JavaWebstartComponent } from './java-webstart.component';

describe('JavaWebstartComponent', () => {
  let component: JavaWebstartComponent;
  let fixture: ComponentFixture<JavaWebstartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavaWebstartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JavaWebstartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
