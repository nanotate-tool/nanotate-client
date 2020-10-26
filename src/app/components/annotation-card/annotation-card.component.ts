import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Annotation } from 'src/app/models';
import { HypothesisService } from 'src/app/services';
import { AnnotationPropsComponent } from 'src/app/utils';

@Component({
  selector: 'a2np-c-annotation-card',
  templateUrl: './annotation-card.component.html',
  styleUrls: ['./annotation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationCardComponent extends AnnotationPropsComponent implements OnInit {

  @Input() annotation: Annotation;
  @Input() gtag: string;

  constructor(private hypothesis: HypothesisService) {
    super();
  }

  ngOnInit(): void {
  }

  get group(): string {
    return this.annotation.group == HypothesisService.PUBLIC_GROUP ? 'Public' :
      this.hypothesis.profileData?.groups?.find(group => group.id == this.annotation.group)?.name;
  }

  get groupIcon(): string {
    return this.annotation.group == HypothesisService.PUBLIC_GROUP ? 'pi pi-globe' : 'pi pi-users';
  }

}
