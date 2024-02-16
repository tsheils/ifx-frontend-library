import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from "@angular/router";

import { GraphqlSandboxComponent } from './graphql-sandbox.component';

describe('GraphqlSandboxComponent', () => {
  let component: GraphqlSandboxComponent;
  let fixture: ComponentFixture<GraphqlSandboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphqlSandboxComponent],
      providers: [{provide: ActivatedRoute, useValue: {}}]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphqlSandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
