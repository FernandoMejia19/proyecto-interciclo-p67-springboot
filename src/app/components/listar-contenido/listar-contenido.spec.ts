import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarContenido } from './listar-contenido';

describe('ListarContenido', () => {
  let component: ListarContenido;
  let fixture: ComponentFixture<ListarContenido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarContenido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarContenido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
