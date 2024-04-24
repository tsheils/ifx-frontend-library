import { TestBed } from '@angular/core/testing';
import { Firestore } from "@angular/fire/firestore";
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Firestore, useValue: {}}]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
