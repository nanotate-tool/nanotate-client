import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services';

@Component({
  selector: 'a2np-c-site-url-editor',
  templateUrl: './site-url-editor.component.html',
  styleUrls: ['./site-url-editor.component.scss']
})
export class SiteUrlEditorComponent implements OnInit {

  @Input() title: string;
  @Input() inline: boolean = false;
  @Input() showContinueButton: boolean = false;
  @Input() showDeleteButton: boolean = false;
  @Output() onNext: EventEmitter<any> = new EventEmitter();

  _inputRegex = 'http[s]?:\/\/(.+)';
  private __form: FormGroup;

  constructor(private fb: FormBuilder, private app: AppService,
    private router: Router) { }

  ngOnInit(): void {
    this.app.subscribe(['app-ch-site-metadata'], () => {
      this.__form = null;
    })
  }

  get form(): FormGroup {
    if (!this.__form) {
      this.__form = this.fb.group({
        site: new FormControl(this.app.siteData.url, Validators.required)
      });
    }
    return this.__form;
  }

  next() {
    if (this.form.valid) {
      this.app.reload({ url: this.form.getRawValue().site });
      this.onNext.emit(this.app.siteData);
    }
  }

  delete() {
    this.app.reload({ url: null });
    this.router.navigate(['/']);
  }

}
