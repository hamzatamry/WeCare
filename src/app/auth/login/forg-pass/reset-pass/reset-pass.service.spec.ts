import { TestBed } from '@angular/core/testing';

import { ResetPassService } from './reset-pass.service';

describe('ResetPassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResetPassService = TestBed.get(ResetPassService);
    expect(service).toBeTruthy();
  });
});
