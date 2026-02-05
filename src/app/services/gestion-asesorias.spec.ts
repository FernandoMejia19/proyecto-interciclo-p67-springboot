import { TestBed } from '@angular/core/testing';

import { GestionAsesorias } from './gestion-asesorias';

describe('GestionAsesorias', () => {
  let service: GestionAsesorias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionAsesorias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
