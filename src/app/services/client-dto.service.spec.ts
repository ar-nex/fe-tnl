import { TestBed } from '@angular/core/testing';

import { ClientDtoService } from './client-dto.service';

describe('ClientDtoService', () => {
  let service: ClientDtoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientDtoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
