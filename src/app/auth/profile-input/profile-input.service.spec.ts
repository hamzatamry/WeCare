import { TestBed } from '@angular/core/testing';

import { ProfileInputService } from './profile-input.service';

describe('ProfileInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileInputService = TestBed.get(ProfileInputService);
    expect(service).toBeTruthy();
  });
});
