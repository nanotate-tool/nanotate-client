import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioAnnotationListComponent } from './bio-annotation-list.component';

describe('BioAnnotationListComponent', () => {
  let component: BioAnnotationListComponent;
  let fixture: ComponentFixture<BioAnnotationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BioAnnotationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BioAnnotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
