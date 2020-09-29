/**
 * representa los datos de una anotacion de la api de bioportal
 */
export interface BioAnnotation {
    id: string;
    class: string;
    ontology: string
    ontologyLabel: string;
    prefLabel: string;
    selector: {
        from: number
        matchType: string;
        text: string
        to: number
    }[]
}