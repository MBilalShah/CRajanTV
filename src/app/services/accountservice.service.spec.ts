import { TestBed } from '@angular/core/testing';

import { AccountserviceService } from './accountservice.service';

describe('AccountserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountserviceService = TestBed.get(AccountserviceService);
    expect(service).toBeTruthy();
  });
});
