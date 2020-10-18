import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMetadataCardComponent } from './site-metadata-card.component';

describe('SiteMetadataCardComponent', () => {
  let component: SiteMetadataCardComponent;
  let fixture: ComponentFixture<SiteMetadataCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteMetadataCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteMetadataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
