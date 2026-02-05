import { TestBed } from '@angular/core/testing';

import { GestionTecnologias } from './gestion-tecnologias';

describe('GestionTecnologias', () => {
  let service: GestionTecnologias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionTecnologias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
