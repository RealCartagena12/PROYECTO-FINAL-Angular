import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriasSensibles } from './historias-sensibles';

describe('HistoriasSensibles', () => {
  let component: HistoriasSensibles;
  let fixture: ComponentFixture<HistoriasSensibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriasSensibles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriasSensibles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
