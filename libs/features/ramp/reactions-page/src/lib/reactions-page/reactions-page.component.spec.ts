import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactionsPageComponent } from './reactions-page.component';

describe('ReactionsPageComponent', () => {
  let component: ReactionsPageComponent;
  let fixture: ComponentFixture<ReactionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
