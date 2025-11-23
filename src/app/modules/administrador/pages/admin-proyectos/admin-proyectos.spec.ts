import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProyectos } from './admin-proyectos';

describe('AdminProyectos', () => {
  let component: AdminProyectos;
  let fixture: ComponentFixture<AdminProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
