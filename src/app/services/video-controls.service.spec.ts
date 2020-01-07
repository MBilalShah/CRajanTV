import { TestBed } from '@angular/core/testing';

import { VideoControlsService } from './video-controls.service';

describe('VideoControlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoControlsService = TestBed.get(VideoControlsService);
    expect(service).toBeTruthy();
  });
});
