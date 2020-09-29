import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Annotation } from 'src/app/models';
import { AnnotationPropsComponent } from 'src/app/utils';

@Component({
  selector: 'a2np-c-annotation-card',
  templateUrl: './annotation-card.component.html',
  styleUrls: ['./annotation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationCardComponent extends AnnotationPropsComponent implements OnInit {

  @Input() annotation: Annotation;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
