import { TestBed } from '@angular/core/testing';

import { GestionUsuarios } from './gestion-usuarios';

describe('GestionUsuarios', () => {
  let service: GestionUsuarios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionUsuarios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
