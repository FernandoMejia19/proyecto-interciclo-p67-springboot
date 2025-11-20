import { TestBed } from '@angular/core/testing';

import { GestionPortafolios } from './gestion-portafolios';

describe('GestionPortafolios', () => {
  let service: GestionPortafolios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionPortafolios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
