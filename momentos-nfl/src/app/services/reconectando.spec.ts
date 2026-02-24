import { TestBed } from '@angular/core/testing';

import { Reconectando } from './reconectando';

describe('Reconectando', () => {
  let service: Reconectando;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reconectando);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
