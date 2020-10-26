import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Optional, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Annotation } from 'src/app/models';
import { HypothesisService } from 'src/app/services';
import { AnnotationPropsComponent, NANOPUBS } from 'src/app/utils';

type Actions = 'edit' | 'delete' | 'nanopub';

@Component({
  selector: 'a2np-c-annotation-actions-bar',
  templateUrl: './annotation-actions-bar.component.html',
  styleUrls: ['./annotation-actions-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationActionsBarComponent extends AnnotationPropsComponent implements OnInit {

  @Output() onAction: EventEmitter<{ action: Actions, annotation, data?: any }> = new EventEmitter();

  procesing: boolean = false;

  constructor(public hypothesisService: HypothesisService, @Optional() private confirmationService: ConfirmationService,
  private el:ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
  }

  edit(annotation: Annotation) {
    this.onAction.emit({
      action: 'edit',
      annotation: annotation
    });
  }

  delete(annotation: Annotation) {
    this.procesing = true;
    this.el.detectChanges();
    return this.confirm().then((_continue) => {
      if (_continue) {
        return this.hypothesisService.deleteAnnotation(annotation).then(response => {
          if (response.deleted) {
            return new Promise(resolve => {
              setTimeout(() => { // delay form hypothesis
                this.onAction.emit({
                  action: 'delete',
                  annotation: annotation
                })
                resolve(response);
              }, 600);
            })
          }
          return response;
        });
      }
      return false;
    }).finally(()=>{
      this.procesing = false;
      this.el.detectChanges();
    });
  }

  nanopub(annotation: Annotation) {
    this.onAction.emit({
      action: 'nanopub',
      annotation: annotation,
      data: {
        step: annotation
      }
    });
  }

  confirm(message:string = 'Are you sure that you want delete this annotation?' ): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message: message,
          accept: () => {
            resolve(true);
          },
          reject: () =>{
            resolve(false);
          }
        });
      } else {
        resolve(true)
      }
    });
  }

  canPerform(action: string): boolean {
    switch (action) {
      case 'nanopub':
        return true;
      case 'edit':
        action = 'update';
      default:
        return this.havePermissionFor(<any>action, this.hypothesisService.profileData.userid);
    }
  }

}
