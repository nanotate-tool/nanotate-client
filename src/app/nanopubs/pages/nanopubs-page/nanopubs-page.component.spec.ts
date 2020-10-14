import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NanopubsPageComponent } from './nanopubs-page.component';

describe('NanopubsPageComponent', () => {
  let component: NanopubsPageComponent;
  let fixture: ComponentFixture<NanopubsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NanopubsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NanopubsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
