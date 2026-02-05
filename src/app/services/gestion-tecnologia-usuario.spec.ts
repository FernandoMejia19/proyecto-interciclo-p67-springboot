import { TestBed } from '@angular/core/testing';

import { GestionTecnologiaUsuario } from './gestion-tecnologia-usuario';

describe('GestionTecnologiaUsuario', () => {
  let service: GestionTecnologiaUsuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionTecnologiaUsuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
