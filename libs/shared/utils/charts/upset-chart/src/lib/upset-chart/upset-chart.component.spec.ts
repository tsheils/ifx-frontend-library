import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpsetComponent } from './upset-chart.component';

Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
  writable: true,
  value: jest.fn().mockReturnValue({
    x: 0,
    y: 0,
  }),
});

describe('UpsetComponent', () => {
  let component: UpsetComponent;
  let fixture: ComponentFixture<UpsetComponent>;
  let componentRef: ComponentRef<UpsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsetComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('chartData', { allSetIds: [], data: [] });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
