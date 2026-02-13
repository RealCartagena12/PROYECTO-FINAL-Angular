import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aporte } from './formulario';

describe('Aporte', () => {
  let component: Aporte;
  let fixture: ComponentFixture<Aporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aporte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aporte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
