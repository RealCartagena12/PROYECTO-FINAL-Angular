import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Historias } from './historias';

describe('Historias', () => {
  let component: Historias;
  let fixture: ComponentFixture<Historias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Historias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Historias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
