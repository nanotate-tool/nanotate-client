import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { BioAnnotation } from 'src/app/models';

@Component({
  selector: 'a2np-c-bio-annotation-list',
  templateUrl: './bio-annotation-list.component.html',
  styleUrls: ['./bio-annotation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BioAnnotationListComponent implements OnInit {

  @Input() selectable: boolean = false;
  @Input() annotations: BioAnnotation[];
  @Input() context: string;
  @Output() onSelect: EventEmitter<BioAnnotation> = new EventEmitter();
  /**
   * contiene las anotaciones selecionadas
   */
  @Input() selected: BioAnnotation[] = [];
  @Output() selectedChange: EventEmitter<BioAnnotation[]> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * proxy of @property selectedAnnotations
   */
  get pselected() {
    return this.selected;
  }

  set pselected(value: BioAnnotation[]) {
    this.selected = value;
    this.selectedChange.emit(value);
  }

  /**
   * realiza el highlight del contexto para el selector pasado
   * @param selector selector de la annotacion
   */
  contextWithSelector(selector: any) {
    if (this.context) {
      const text = this.context.substring(selector.from - 1, selector.to);
      return this.context.replace(text, `<span class="text-highlight">${text}</span>`);
    }
    return "unknow";
  }

}
