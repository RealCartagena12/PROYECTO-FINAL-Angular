import { TestBed } from '@angular/core/testing';

import { HistoriasSensibles } from './historias-sensibles';

describe('HistoriasSensibles', () => {
  let service: HistoriasSensibles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriasSensibles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
