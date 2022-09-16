import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasSearchComponent } from './rdas-search.component';

describe('RdasSearchComponent', () => {
  let component: RdasSearchComponent;
  let fixture: ComponentFixture<RdasSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
