import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasHeaderComponent } from './rdas-header.component';

describe('RdasHeaderComponent', () => {
  let component: RdasHeaderComponent;
  let fixture: ComponentFixture<RdasHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
