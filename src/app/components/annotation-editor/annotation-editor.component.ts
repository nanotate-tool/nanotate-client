import { Component, OnInit, ChangeDetectionStrategy, Input, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Annotation, AnnotationRequest, BioAnnotation } from 'src/app/models';
import { HypothesisService, NanopubsService } from 'src/app/services';
import { AnnotationPropsComponent, NANOPUBS } from 'src/app/utils';

declare var hlib;

@Component({
  selector: 'a2np-c-annotation-editor',
  templateUrl: './annotation-editor.component.html',
  styleUrls: ['./annotation-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationEditorComponent extends AnnotationPropsComponent implements OnInit {

  @Output() onUpdate: EventEmitter<Annotation> = new EventEmitter();

  private _form: FormGroup;
  /**
   * annotation tags
   */
  tagsItems: SelectItem[];
  /**
   * annotation ontologies
   */
  ontologiesItems: SelectItem[];
  /**
   * annotations of ontology group in bioportal
   */
  bioAnnotations: BioAnnotation[];
  /**
   * annotations of bioportal ontology selected
   */
  selectedBioAnnotations: BioAnnotation[];
  /**
   * contains at map of states for all process of control
   */
  procesingStates = { fetchingBioAnnotations: false, saving: false };

  constructor(private hypothesisService: HypothesisService, private fb: FormBuilder, private nanopubs: NanopubsService,
    private el: ChangeDetectorRef, private messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
    this.initOntologiesItems();
    this.initloadTagsItems();
  }

  get form(): FormGroup {
    if (!this._form) {
      this._form = this.fb.group({
        text: [this.text],
        tags: [this.tags[0], Validators.required],
        ontologies: [this.ontologies[0]]
      });
      this.onChangeTag();
      this.onChangeOntology(false);
    }
    return this._form;
  }

  /**
   * determina si se muestra el buscador de anotaciones para la ontologia
   */
  get canShowAnnotationSeachs(): boolean {
    const tags = this.form.controls.tags.value;
    const ontologies = this.form.controls.ontologies.value
    return (!NANOPUBS.isStepAnnotation({ tags: [tags] }) && tags
      && ontologies) && true;
  }

  /**
   * retorna la anotacion en su valor bruto,
   * aplicando todos los cambios realizados
   */
  private get rawAnnotation(): Annotation {
    const formProps = this.form.getRawValue();
    var tags = [formProps.tags];
    if (formProps.ontologies) {
      tags.push(NANOPUBS.encodeOntologyTag(formProps.ontologies));
    }
    if (this.selectedBioAnnotations) {
      this.setSetting('bio_annotations', this.selectedBioAnnotations.map(annotation => annotation.id));
    }
    return { ...this.annotation, tags: tags, text: `${this.strSettings}${formProps.text}` || "" };
  }

  reload() {
    super.reload();
    this._form = null;
    this.bioAnnotations = null;
    this.el.markForCheck();
  }

  /**
   * realiza el proceso de publicacion de la annotacion
   */
  publish() {
    if (this.form.valid) {
      const annotation = this.rawAnnotation;
      const _operation = annotation.id ? this.hypothesisService.updateAnnotation(annotation) : this.hypothesisService.postAnnotation(annotation);
      _operation.then(response => {
        if (response?.response) {
          this.annotation = response.response;
          this.onUpdate.emit(response.response);
          this.reload();
          this.messageService.add({ severity: 'success', summary: 'Ok on publishing' })
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error on publishing', detail: response?.reason })
        }
      });
    }
  }

  /**
   * control del cambio del tag de la anotacion
   */
  onChangeTag() {
    setTimeout(() => {
      if (NANOPUBS.isStepAnnotation({ tags: [this.form.controls.tags.value] })) {
        this.form.controls.ontologies.setValue(null);
        this.form.controls.ontologies.disable();
      } else {
        this.form.controls.ontologies.enable();
      }
      this.el.markForCheck();
    }, 1);
  }

  /**
   * control de cambio de la ontolgia de la anotacion
   */
  onChangeOntology(_new: boolean = true) {
    const ontologies = this.form.controls.ontologies.value;
    if (ontologies) {
      this.procesingStates.fetchingBioAnnotations = true;
      this.nanopubs.bioAnnotations([ontologies], this.exact).then(annotations => {
        this.bioAnnotations = annotations;
        this.selectedBioAnnotations = _new ? this.bioAnnotations : this.bioAnnotations.
          filter(annotation => !this.settings.bio_annotations || this.settings.bio_annotations.includes(annotation.id));
        this.el.markForCheck();
      }).finally(() => this.procesingStates.fetchingBioAnnotations = false);
    }
  }

  private initOntologiesItems() {
    this.ontologiesItems = [{ label: 'Without Ontology', value: null }]
      .concat(this.nanopubs.config().ontologies.map(ontology => ({ label: ontology, value: ontology })));
  }

  private initloadTagsItems() {
    this.tagsItems = [{ label: 'Select Tag', value: null }]
      .concat(this.nanopubs.config().tags.map(tag => ({ label: tag, value: tag })));
  }

}
