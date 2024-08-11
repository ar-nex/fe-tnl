import { TestBed } from '@angular/core/testing';

import { FullNameService } from './full-name.service';

describe('FullNameService', () => {
  let service: FullNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
