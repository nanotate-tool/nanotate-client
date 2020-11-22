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
        tags: [this.tags, Validators.required],
        ontologies: [this.ontologies]
      });
      this.onChangeTag();
      this.onChangeOntology(false);
    }
    return this._form;
  }

  /**
   * determina si se muestra el buscador de anotaciones para la ontologia
   */
  get canShowAnnotationSearch(): boolean {
    const tags = this.form.controls.tags.value;
    const ontologies = this.form.controls.ontologies.value
    return (!NANOPUBS.isStepAnnotation({ tags: tags })
      && ontologies && ontologies.length > 0) && true;
  }

  /**
   * retorna la anotacion en su valor bruto,
   * aplicando todos los cambios realizados
   */
  private get rawAnnotation(): Annotation {
    const formProps = this.form.getRawValue();
    var tags = formProps.tags;
    if (formProps.ontologies && formProps.ontologies.length > 0) {
      tags = tags.concat(formProps.ontologies.map(ontology => NANOPUBS.encodeOntologyTag(ontology)));
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
   * determines if control has any error
   * and checking if this has been touched or dirty
   * @param control control alias to check
   * @param submitted determines if parent form was submitted (default = true)
   */
  isInvalidControl(control: string, submitted: boolean = true) {
    return (submitted || this.form && this.form.controls[control]
      && this.form.controls[control].touched || this.form.controls[control].dirty)
      && this.form?.controls[control].invalid;
  }

  /**
   * realiza el proceso de publicacion de la annotacion
   */
  publish() {
    if (this.form.valid) {
      this.procesingStates.saving = true;
      const annotation = this.rawAnnotation;
      const _operation = annotation.id ? this.hypothesisService.updateAnnotation(annotation) : this.hypothesisService.postAnnotation(annotation);
      return _operation.then(response => {
        return new Promise((resolve) => {
          if (response?.response) {
            this.annotation = response.response;
            setTimeout(() => {
              this.onUpdate.emit(response.response);
              this.reload();
              this.messageService.add({ severity: 'success', summary: 'Ok on publishing' })
              resolve(response.response)
            }, 500);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error on publishing', detail: response?.reason })
          }
          return response;
        });
      }).finally(() => {
        this.procesingStates.saving = false;
      });
    } else {
      if (this.form.controls.tags.invalid) {
        this.messageService.add({ severity: 'error', summary: "Please, add a tag to the selected text before to publish", sticky: true })
      }
      return Promise.reject('invalid-form')
    }
  }

  /**
   * control del cambio del tag de la anotacion
   */
  onChangeTag() {
    setTimeout(() => {
      if (NANOPUBS.isStepAnnotation({ tags: this.form.controls.tags.value })) {
        this.form.controls.tags.setValue([NANOPUBS.STEP_TAG]);
        this.form.controls.ontologies.setValue(null);
        this.form.controls.ontologies.disable();
        this.initloadTagsItems(true);
      } else {
        this.form.controls.ontologies.setValue(this.ontologies);
        this.form.controls.ontologies.enable();
        this.initloadTagsItems(false);
      }
      this.el.markForCheck();
    }, 1);
  }

  /**
   * control de cambio de la ontolgia de la anotacion
   */
  onChangeOntology(_new: boolean = true) {
    const ontologies = this.form.controls.ontologies.value;
    if (ontologies && ontologies.length > 0) {
      this.procesingStates.fetchingBioAnnotations = true;
      this.el.markForCheck();
      this.nanopubs.bioAnnotations(ontologies, this.exact).then(annotations => {
        this.bioAnnotations = annotations;
        this.selectedBioAnnotations = _new ? this.bioAnnotations : this.bioAnnotations.
          filter(annotation => !this.settings.bio_annotations || this.settings.bio_annotations.includes(annotation.id));
        this.el.markForCheck();
      }).finally(() => this.procesingStates.fetchingBioAnnotations = false);
    } else {
      this.bioAnnotations = null;
      this.el.markForCheck();
    }
  }

  private initOntologiesItems() {
    this.nanopubs.settings.then(settings => {
      this.ontologiesItems = settings.ontologies.map(
        ontology => ({ label: ontology, value: ontology })
      );
      this.el.markForCheck();
    });
  }

  private initloadTagsItems(disable: boolean = false) {
    this.nanopubs.settings.then(settings => {
      this.tagsItems = settings.tags.map(
        tag => ({ label: tag, value: tag, disabled: tag != NANOPUBS.STEP_TAG ? disable : false })
      );
      this.el.markForCheck();
    });

  }

}
