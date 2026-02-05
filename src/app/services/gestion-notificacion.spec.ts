import { TestBed } from '@angular/core/testing';

import { GestionNotificacion } from './gestion-notificacion';

describe('GestionNotificacion', () => {
  let service: GestionNotificacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionNotificacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
