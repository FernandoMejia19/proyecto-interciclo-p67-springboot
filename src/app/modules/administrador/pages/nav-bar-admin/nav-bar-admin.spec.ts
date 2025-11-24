import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarAdmin } from './nav-bar-admin';

describe('NavBarAdmin', () => {
  let component: NavBarAdmin;
  let fixture: ComponentFixture<NavBarAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
