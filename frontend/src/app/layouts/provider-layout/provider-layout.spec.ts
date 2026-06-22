import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderLayout } from './provider-layout';

describe('ProviderLayout', () => {
  let component: ProviderLayout;
  let fixture: ComponentFixture<ProviderLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
