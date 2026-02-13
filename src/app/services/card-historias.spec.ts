import { TestBed } from '@angular/core/testing';

import { CardHistorias } from './card-historias';

describe('CardHistorias', () => {
  let service: CardHistorias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardHistorias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
