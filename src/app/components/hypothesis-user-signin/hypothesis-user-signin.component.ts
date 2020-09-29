import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HypothesisService } from 'src/app/services';

declare var hlib;

@Component({
  selector: 'a2np-c-hypothesis-user-signin',
  templateUrl: './hypothesis-user-signin.component.html',
  styleUrls: ['./hypothesis-user-signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HypothesisUserSigninComponent implements OnInit, AfterViewInit {

  @Output() onContinue: EventEmitter<any> = new EventEmitter();
  private _form: FormGroup;

  constructor(private hypothesis: HypothesisService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.initHypothesisUserData();
  }

  get form(): FormGroup {
    if (!this._form) {
      this._form = this.fb.group({
        username: [hlib.getUser(), Validators.required],
        token: [hlib.getToken(), Validators.required]
      });
    }
    return this._form;
  }

  get h_tokenUrl(): string {
    return this.hypothesis.hypothesisDeveloperLink;
  }

  _continue() {
    if (this.form.valid) {
      const signInData = this.form.getRawValue();
      this.hypothesis.hypothesis_user = signInData;
      this.onContinue.emit();
    }
  }

}
