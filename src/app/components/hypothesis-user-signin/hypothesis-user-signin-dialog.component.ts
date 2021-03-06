import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    template: `
    <a2np-c-hypothesis-user-signin (onContinue)="__continue($event)" [showRemoveSession]="showRemoveSession"></a2np-c-hypothesis-user-signin>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HypothesisUserSigninDialogComponent {

    constructor(private config: DynamicDialogConfig) {
    }

    get showRemoveSession() {
        return this.config.data.showRemoveSession;
    }

    __continue(destroy) {
        if (this.config.data && this.config.data.backdoor) {
            this.config.data.backdoor(destroy);
        }
    }

}
