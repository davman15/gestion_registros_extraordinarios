import { TestBed } from '@angular/core/testing';

import { SacardatosService } from './sacardatos.service';

describe('SacardatosService', () => {
  let service: SacardatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SacardatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
