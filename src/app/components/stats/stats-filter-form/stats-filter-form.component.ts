import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { StatsFilterForm } from 'src/app/models';
import { AppService, NanopubsService } from 'src/app/services';

@Component({
  selector: 'a2np-c-stats-filter-form',
  templateUrl: './stats-filter-form.component.html',
  styleUrls: ['./stats-filter-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsFilterFormComponent implements OnInit {

  @Input() filterForm: StatsFilterForm = {};
  @Output() onFilter: EventEmitter<StatsFilterForm> = new EventEmitter();

  tagsItems: SelectItem[];

  private _form: FormGroup;

  constructor(private fb: FormBuilder, private nanopubs: NanopubsService, private el: ChangeDetectorRef,
    private app: AppService) { }

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.filterForm = this.filterForm || {};
    this._form = null;
    this.initTags();
  }

  get form(): FormGroup {
    if (!this._form) {
      this._form = this.fb.group({
        'protocol': [this.filterForm.protocol],
        'users': [this.filterForm.users],
        'tags': [this.filterForm.tags],
      })
    }
    return this._form;
  }

  get rawFilterForm() {
    let rawValues = this.form.getRawValue();
    rawValues = Object.keys(rawValues).reduce((filter, field) => {
      if (rawValues[field]) {
        filter[field] = rawValues[field];
      }
      return filter;
    }, {});
    if (rawValues.users) {
      rawValues.users = rawValues.users.map(user => `acct:${user}@hypothes.is`);
    }
    return rawValues;
  }

  filter() {
    if (this.form.valid) {
      this.onFilter.emit(this.rawFilterForm);
    }
  }

  private initTags() {
    this.nanopubs.settings.then(settings => {
      this.tagsItems = settings.tags.map(
        tag => ({ label: tag, value: tag })
      );
      this.el.markForCheck();
    });
  }

}
