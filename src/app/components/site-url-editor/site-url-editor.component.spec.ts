import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteUrlEditorComponent } from './site-url-editor.component';

describe('SiteUrlEditorComponent', () => {
  let component: SiteUrlEditorComponent;
  let fixture: ComponentFixture<SiteUrlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteUrlEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteUrlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
