import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NanopubsComponent } from './nanopubs.component';

describe('NanopubsComponent', () => {
  let component: NanopubsComponent;
  let fixture: ComponentFixture<NanopubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NanopubsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NanopubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
