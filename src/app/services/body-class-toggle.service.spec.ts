import { TestBed } from '@angular/core/testing';

import { BodyClassToggleService } from './body-class-toggle.service';

describe('BodyClassToggleService', () => {
  let service: BodyClassToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyClassToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
