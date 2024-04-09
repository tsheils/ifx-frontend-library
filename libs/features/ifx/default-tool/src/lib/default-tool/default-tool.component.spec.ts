import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultToolComponent } from './default-tool.component';

describe('DefaultToolComponent', () => {
  let component: DefaultToolComponent;
  let fixture: ComponentFixture<DefaultToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultToolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
