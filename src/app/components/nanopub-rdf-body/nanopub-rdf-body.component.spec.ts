import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NanopubRdfBodyComponent } from './nanopub-rdf-body.component';

describe('NanopubRdfBodyComponent', () => {
  let component: NanopubRdfBodyComponent;
  let fixture: ComponentFixture<NanopubRdfBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NanopubRdfBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NanopubRdfBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
