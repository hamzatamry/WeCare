import { TestBed, async, inject } from '@angular/core/testing';

import { ProfileInputGuard } from './profile-input.guard';

describe('ProfileInputGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileInputGuard]
    });
  });

  it('should ...', inject([ProfileInputGuard], (guard: ProfileInputGuard) => {
    expect(guard).toBeTruthy();
  }));
});
