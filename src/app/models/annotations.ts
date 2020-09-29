/**
 * contiene los datos iniciales para iniciar el proceso de registro
 * de una annotacion en hypothesis
 */
export interface AnnotationSelector {
    uri: string;
    title: string;
    exact: string;
    prefix: string;
    start: number;
    end: number;
}

/**
 * contiene los datos de solicitud para el registro de una annotacion
 * en hypothesis
 */
export interface AnnotationRequest extends AnnotationSelector {
    username?: string;
    group: string;
    tags: string[];
    text: string;
}


export interface TextQuoteSelector {
    type: 'TextQuoteSelector';
    exact: string,
    prefix: string,
    suffix: string
}

export interface TextPositionSelector {
    type: 'TextPositionSelector';
    start: number;
    end: number;
}

export interface RangeSelector {
    type: 'RangeSelector';
    startContainer: string;
    endContainer: string;
    startOffset: number;
    endOffset: number
}

export interface Target {
    source: string
    selector: (TextQuoteSelector | TextPositionSelector | RangeSelector)[];
}

/**
 * @typedef Target
 * @prop {string} source
 * @prop {Selector[]} [selector]
 *
 * */

export interface Annotation {
    id?: string;
    references?: string[];
    created?: string;
    flagged?: boolean;
    group: string
    updated?: string;
    tags: string[];
    text: string;
    uri: string[];
    user: string[];
    hidden?: boolean;
    document: { title: string };
    permissions: { read: string[], update: string[], delete: string[] }
    target: Target[];
    moderation: { flagCount: number };
    links?: { incontext: string, html: string };
    user_info?: { display_name: string }
}