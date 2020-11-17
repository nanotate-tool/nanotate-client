import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NanopubActionBarComponent } from './nanopub-action-bar.component';

describe('NanopubActionBarComponent', () => {
  let component: NanopubActionBarComponent;
  let fixture: ComponentFixture<NanopubActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NanopubActionBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NanopubActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
