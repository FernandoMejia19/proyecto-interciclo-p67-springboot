import { TestBed } from '@angular/core/testing';

import { GestionTecnologiaProyecto } from './gestion-tecnologia-proyecto';

describe('GestionTecnologiaProyecto', () => {
  let service: GestionTecnologiaProyecto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionTecnologiaProyecto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
