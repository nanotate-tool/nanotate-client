import {
  Component, OnInit, ChangeDetectionStrategy, AfterViewInit, Output,
  EventEmitter, ChangeDetectorRef, Input
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HypothesisService } from 'src/app/services';

@Component({
  selector: 'a2np-c-hypothesis-user-signin',
  templateUrl: './hypothesis-user-signin.component.html',
  styleUrls: ['./hypothesis-user-signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HypothesisUserSigninComponent implements OnInit, AfterViewInit {

  @Input() showRemoveSession: boolean = false;
  @Output() onContinue: EventEmitter<any> = new EventEmitter();
  private _form: FormGroup;
  public processing: boolean = false;
  public processingError: string = null;

  constructor(private hypothesis: HypothesisService, private fb: FormBuilder,
    private messageService: MessageService, private el: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.initHypothesisUserData();
  }

  /**
   * defines if has begun any session
   */
  get hasSession() {
    return this.hypothesis.haveUser;
  }

  get form(): FormGroup {
    if (!this._form) {
      const user_data = this.hypothesis.hypothesis_user;
      this._form = this.fb.group({
        username: [user_data.username, Validators.required],
        token: [user_data.token, Validators.required]
      });
    }
    return this._form;
  }

  get h_tokenUrl(): string {
    return this.hypothesis.hypothesisDeveloperLink;
  }

  /**
   * clear the current session if have any
   */
  clearSession() {
    if (this.hasSession) {
      this.onContinue.emit(true);
      this.hypothesis.logout();
      this.el.markForCheck();
    }
  }

  _continue() {
    if (this.form.valid) {
      this.processing = true;
      this.processingError = null;
      const signInData = this.form.getRawValue();
      this.hypothesis.auth(signInData.username, signInData.token)
        .then(response => {
          this.onContinue.emit();
        }).catch(error => {
          this.processingError = error;
          this.messageService.add({ severity: 'error', detail: error });
        }).finally(() => {
          this.processing = false;
          this.el.markForCheck();
        });
    }
  }

}
