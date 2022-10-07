import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasHomeComponent } from './rdas-home.component';

describe('RdasHomeComponent', () => {
  let component: RdasHomeComponent;
  let fixture: ComponentFixture<RdasHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
