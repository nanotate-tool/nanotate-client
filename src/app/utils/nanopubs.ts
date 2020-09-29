//============= TOOLS =============

// custom settings vars for annotations
const SETTINGS_STR_START: string = '===SETTINGS===\n';
const SETTINGS_STR_END: string = '\n===END SETTINGS===\n';
const SETTINGS_PROPS_MAPPER = {
    ',': '%1',
    ':': '%2',
    '\n': '%3'
};

export const SETTINGS_PATTER: RegExp = /===SETTINGS===\n(.*\===END SETTINGS===\n)/s;

/**
 * realiza el proceso de descodificar un settings anteriormente codificado
 * desde el string pasado
 * @param source string a decodificar
 */
export function decodeSettings(source: string): { [key: string]: string[] } {
    let settings_matcher = source.match(SETTINGS_PATTER);
    if (!settings_matcher) {
        return {};
    }
    let settings_str = settings_matcher.shift()
        .replace(SETTINGS_STR_START, '').replace(SETTINGS_STR_END, '');
    const settingsLines = settings_str.split('\n');
    return settingsLines.reduce((settings, line) => {
        const entrySet = line.split(':');
        settings[entrySet[0]] = entrySet[1].split(',').map(_var => propsSettings(_var, 'decode'));
        return settings;
    }, {});
}

/**
 * codifica las propiedades de la annotacion al formato de string
 * 
 * @param settings settings a codificar
 */
export function encodeSettings(settings: { [key: string]: string[] }): string {
    let settings_entries = Object.entries(settings);
    return settings_entries.reduce((str, entry) => {
        const [prop, value] = entry;
        if (value) {
            const encode_value = value.map(_var => propsSettings(_var, 'encode')).join(',');
            return str.concat(prop, ':', encode_value);
        }
        return str;
    }, SETTINGS_STR_START).concat(SETTINGS_STR_END);
}

/**
 * decodifica o descodifica caracteres especiales de los settings a la cadena pasada
 * @param _var string a realizar la operacion 
 * @param flag determina la operacion a realizar
 */
export function propsSettings(_var: string, flag: 'encode' | 'decode'): string {
    let parse_var = _var;
    for (const key in SETTINGS_PROPS_MAPPER) {
        const value = SETTINGS_PROPS_MAPPER[key];
        let [regex, replace] = flag == 'decode' ? [new RegExp(value, 'g'), key] : [new RegExp(key, 'g'), value];
        parse_var = parse_var.replace(regex, replace);
    }
    return parse_var;
}


/**
 * codifica la tag en un formato de tag de ontologia ('_tag_')
 * @example 'CHEBI' => '_CHEBI_'
 * @param {string} tag tag a evaluar
 */
export function encodeOntologyTag(tag) {
    return tag ? `_${tag}_` : tag;
}

/**
 * decodifica una tag de ontologia('_X_') a un tag en formato comun
 * @example '_CHEBI_' => 'CHEBI'
 * @param {string} tag tag a evaluar
 * @param {boolean} _eval determina si se evalua si la etiqueta es un tag de ontologia #isTagOntologie -> default true
 */
export function decodeOntologyTag(tag, _eval = true) {
    return !_eval || isOntologyTag(tag) ? tag.substring(1, tag.length - 1) : tag;
}

/**
 * determina si la etiqueta pasada es una ontolgia
 * @param {string} tag etiqueta a evaluar
 */
export function isOntologyTag(tag) {
    return tag && tag.startsWith('_') && tag.endsWith('_');
}

/**
 * retorna `true` si la annotation contiene en sus etiquetas a `'step'`
 * @param annotation 
 */
export function isStepAnnotation(annotation: { tags: string[] }) {
    return annotation && annotation.tags.includes('step');
}

/**
 * retorna la metaData de el texto seleccionado para la annotacion
 * @param {Annotation} annotation 
 */
export function getAnnotationMetadata(annotation) {
    const annotationSelector = annotation.target[0].selector;
    const textQuoteSelector = annotationSelector?.filter(args => args.type == 'TextQuoteSelector')[0];
    const textPositionSelector = annotationSelector?.filter(args => args.type == 'TextPositionSelector')[0];
    return {
        prefix: textQuoteSelector?.['prefix'],
        exact: textQuoteSelector?.['exact'],
        suffix: textQuoteSelector?.['suffix'],
        start: textPositionSelector?.['start'],
        end: textPositionSelector?.['end'],
    }
}

/**
 * realiza el formateo de la annotacion pasada a un formato para
 * realizar la nanopublicacion
 * @param annotation 
 */
export function formatAnnotation(annotation) {
    if (annotation) {
        const annotationSelector = annotation.target[0].selector;
        const textQuoteSelector = annotationSelector?.filter(args => args.type == 'TextQuoteSelector')[0];
        const textPositionSelector = annotationSelector?.filter(args => args.type == 'TextPositionSelector')[0];
        const [settings, text] = !annotation.text ? [undefined, ""] :
            [decodeSettings(annotation.text), annotation.text.replace(SETTINGS_PATTER, "")];
        return {
            id: annotation.id,
            authority: annotation.group,
            url: annotation.uri,
            created: annotation.created,
            updated: annotation.updated,
            title: annotation.document.title,
            refs: [],
            isReply: false,
            isPagenote: false,
            user: annotation.user,
            displayName: annotation['user_info'] ? annotation['user_info'].display_name : null,
            text: text,
            prefix: textQuoteSelector?.['prefix'],
            exact: textQuoteSelector?.['exact'],
            suffix: textQuoteSelector?.['suffix'],
            start: textPositionSelector?.['start'],
            end: textPositionSelector?.['end'],
            tags: annotation.tags,
            group: annotation.group,
            ontologies: annotation.tags.filter(isOntologyTag).map(tag => decodeOntologyTag(tag, false)),
            settings: settings
        }
    }
    return null;
}