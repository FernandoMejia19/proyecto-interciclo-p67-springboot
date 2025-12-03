import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrograProyectos } from './progra-proyectos';

describe('PrograProyectos', () => {
  let component: PrograProyectos;
  let fixture: ComponentFixture<PrograProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrograProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrograProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
