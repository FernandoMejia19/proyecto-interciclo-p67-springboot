import { TestBed } from '@angular/core/testing';

import { GestionProyectos } from './gestion-proyectos';

describe('GestionProyectos', () => {
  let service: GestionProyectos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionProyectos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
