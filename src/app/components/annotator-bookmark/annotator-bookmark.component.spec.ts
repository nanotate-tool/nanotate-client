import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatorBookmarkComponent } from './annotator-bookmark.component';

describe('AnnotatorBookmarkComponent', () => {
  let component: AnnotatorBookmarkComponent;
  let fixture: ComponentFixture<AnnotatorBookmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotatorBookmarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotatorBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
