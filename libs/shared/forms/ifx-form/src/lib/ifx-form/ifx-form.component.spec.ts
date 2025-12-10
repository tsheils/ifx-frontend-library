import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IfxFormComponent } from './ifx-form.component';

describe('IfxFormComponent', () => {
  let component: IfxFormComponent;
  let fixture: ComponentFixture<IfxFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IfxFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IfxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
