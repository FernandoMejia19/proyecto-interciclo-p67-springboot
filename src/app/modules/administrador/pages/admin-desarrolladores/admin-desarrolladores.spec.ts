import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDesarrolladores } from './admin-desarrolladores';

describe('AdminDesarrolladores', () => {
  let component: AdminDesarrolladores;
  let fixture: ComponentFixture<AdminDesarrolladores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDesarrolladores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDesarrolladores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
