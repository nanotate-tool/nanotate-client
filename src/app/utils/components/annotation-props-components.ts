import { Directive, Input, OnDestroy } from '@angular/core';
import { Annotation } from 'src/app/models';
import { clearHypothesisUser } from 'src/app/services/hypothesis.service';
import * as NANOPUBS from '../nanopubs';

/**
 * componente-base para coponents que necesiten controlar las subscripciones
 * a eventos, en el momento de destruccion del componente se cierran todas
 * las susbcripciones
 */
@Directive()
export class AnnotationPropsComponent {
    @Input() annotation: Annotation;
    protected _exact: string;
    protected _settings: { [key: string]: string[] };

    /**
     * proceso manual de recarga del componente
     */
    reload() {
        this._settings = null;
        this._exact = null;
    }

    /**
     * retorna el author de la anotacion
     */
    get author(): string {
        return clearHypothesisUser(this.annotation?.user);
    }

    /**
     * retorna el exact de la annotacion
     */
    get exact() {
        if (!this._exact && this.annotation) {
            this._exact = NANOPUBS.getAnnotationMetadata(this.annotation).exact;
        }
        return this._exact;
    }

    /**
     * retorna las configuraciones de la anotacion
     */
    get settings() {
        if (!this._settings) {
            this._settings = NANOPUBS.decodeSettings(this.annotation.text);
        }
        return this._settings;
    }

    /**
     * retorna las configuraciones de la anotacion en un formato string
     * codificado
     */
    get strSettings(): string {
        return NANOPUBS.encodeSettings(this.settings);
    }

    /**
     * retorna el texto personalizado de la anotacion
     */
    get text(): string {
        return this.annotation && this.annotation.text ? this.annotation.text.replace(NANOPUBS.SETTINGS_PATTER, '') : '';
    }

    /**
     * tags de la anotacion
     */
    get tags(): string[] {
        return this.annotation && this.annotation.tags ? this.annotation.tags.filter(tag => !NANOPUBS.isOntologyTag(tag)) : [];
    }

    /**
     * ontologias de la anotacion
     */
    get ontologies(): string[] {
        return this.annotation && this.annotation.tags ? this.annotation.tags.filter(tag => NANOPUBS.isOntologyTag(tag))
            .map(ontology => NANOPUBS.decodeOntologyTag(ontology)) : [];
    }

    /**
     * determina si la anotacion de la instancia actual
     * es de tipo step
     */
    get isStepAnnotation(): boolean {
        return this.annotation && NANOPUBS.isStepAnnotation(this.annotation);
    }

    /**
     * returns simple metadata about of annotations in this instance
     */
    get annotationMetaData() {
        return NANOPUBS.getAnnotationMetadata(this.annotation);
    }

    /**
     * cambia el valor de la variable en el settings de la anotacion
     * @param key variable en la configuracion
     * @param value valor a aplicar
     */
    setSetting(key: string, value: string[]) {
        this.settings[key] = value;
    }

    /**
     * determina si el usuario tiene permisos para cierta accion
     * true si tiene permisos false de lo contrario
     * @param action accion a verificar el permiso
     * @param user identificador del usuario que quiere realizar la accion
     */
    havePermissionFor(action: 'delete' | 'update', user: string): boolean {
        if (user && this.annotation?.permissions && this.annotation.permissions[action]) {
            return this.annotation.permissions[action].includes(user.trim());
        }
        return false;
    }

}