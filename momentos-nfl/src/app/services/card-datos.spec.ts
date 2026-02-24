import { TestBed } from '@angular/core/testing';

import { CardDatos } from './card-datos';

describe('CardDatos', () => {
  let service: CardDatos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardDatos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
