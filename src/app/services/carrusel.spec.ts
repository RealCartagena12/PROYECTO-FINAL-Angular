import { TestBed } from '@angular/core/testing';

import { Carrusel } from './carrusel';

describe('Carrusel', () => {
  let service: Carrusel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Carrusel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
