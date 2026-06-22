import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderEarnings } from './provider-earnings';

describe('ProviderEarnings', () => {
  let component: ProviderEarnings;
  let fixture: ComponentFixture<ProviderEarnings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderEarnings],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderEarnings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
