import { TestBed } from '@angular/core/testing';

import { GestionHoras } from './gestion-horas';

describe('GestionHoras', () => {
  let service: GestionHoras;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionHoras);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
