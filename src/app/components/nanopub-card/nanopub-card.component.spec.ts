import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NanopubCardComponent } from './nanopub-card.component';

describe('NanopubCardComponent', () => {
  let component: NanopubCardComponent;
  let fixture: ComponentFixture<NanopubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NanopubCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NanopubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
