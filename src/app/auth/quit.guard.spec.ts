import { TestBed, async, inject } from '@angular/core/testing';

import { QuitGuard } from './quit.guard';

describe('QuitGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuitGuard]
    });
  });

  it('should ...', inject([QuitGuard], (guard: QuitGuard) => {
    expect(guard).toBeTruthy();
  }));
});
