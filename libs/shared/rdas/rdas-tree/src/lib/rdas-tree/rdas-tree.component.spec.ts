import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasTreeComponent } from './rdas-tree.component';

describe('RdasTreeComponent', () => {
  let component: RdasTreeComponent;
  let fixture: ComponentFixture<RdasTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdasTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
