import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphqlSandboxComponent } from './graphql-sandbox.component';

describe('GraphqlSandboxComponent', () => {
  let component: GraphqlSandboxComponent;
  let fixture: ComponentFixture<GraphqlSandboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphqlSandboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphqlSandboxComponent);
    component = fixture.componentInstance;
    component.isBrowser = false
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
