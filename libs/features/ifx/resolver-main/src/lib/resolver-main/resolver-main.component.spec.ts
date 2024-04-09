import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResolverMainComponent } from './resolver-main.component';

describe('ResolverMainComponent', () => {
  let component: ResolverMainComponent;
  let fixture: ComponentFixture<ResolverMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolverMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResolverMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
