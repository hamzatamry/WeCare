import { TestBed } from '@angular/core/testing';

import { ImagePickerService } from './image-picker.service';

describe('ImagePickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagePickerService = TestBed.get(ImagePickerService);
    expect(service).toBeTruthy();
  });
});
