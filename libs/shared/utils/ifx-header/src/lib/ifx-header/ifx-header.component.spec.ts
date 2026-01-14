import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IfxHeaderComponent } from './ifx-header.component';

describe('NcatsHeaderComponent', () => {
  let component: IfxHeaderComponent;
  let fixture: ComponentFixture<IfxHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IfxHeaderComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(IfxHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
