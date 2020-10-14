import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NanopubPublisherComponent } from './nanopub-publisher.component';

describe('NanopubPublisherComponent', () => {
  let component: NanopubPublisherComponent;
  let fixture: ComponentFixture<NanopubPublisherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NanopubPublisherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NanopubPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
