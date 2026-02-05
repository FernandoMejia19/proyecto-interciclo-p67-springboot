import { TestBed } from '@angular/core/testing';

import { GestionReservas } from './gestion-reservas';

describe('GestionReservas', () => {
  let service: GestionReservas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionReservas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
