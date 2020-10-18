import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NanopubListComponent } from './nanopub-list.component';

describe('NanopubListComponent', () => {
  let component: NanopubListComponent;
  let fixture: ComponentFixture<NanopubListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NanopubListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NanopubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
