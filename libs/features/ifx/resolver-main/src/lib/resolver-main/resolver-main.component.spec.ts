import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { RESOLVER_FEATURE_KEY, resolverReducer } from 'resolver-store';
import { ResolverMainComponent } from './resolver-main.component';

describe('ResolverMainComponent', () => {
  let component: ResolverMainComponent;
  let fixture: ComponentFixture<ResolverMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResolverMainComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RESOLVER_FEATURE_KEY, resolverReducer),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ResolverMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
