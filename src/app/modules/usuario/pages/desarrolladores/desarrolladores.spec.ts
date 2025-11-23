import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Desarrolladores } from './desarrolladores';

describe('Desarrolladores', () => {
  let component: Desarrolladores;
  let fixture: ComponentFixture<Desarrolladores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Desarrolladores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Desarrolladores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
