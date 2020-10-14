/**
 * contiene el rdf de una nanopublicacion en formato json-html
 */
export interface NanopubHtml {
    '@prefixs': string[];
    '@assertion': string;
    '@provenance': string;
    '@pubInfo': string;
    '@Head': string;
}

/**
 * contiene los datos de un componente
 * de una nanopublicacion registrada
 */
export interface NanopublicationComponent {
    id: string,
    ontologies: string[],
    rel_uris: string[],
    tags: string[],
    term: string
}

/**
 * contiene los datos de las de una nanopublicacion
 * registrada
 */
export interface Nanopublication {
    id: string;
    title: string;
    author: string;
    components: NanopublicationComponent[]
    created_at: Date;
    updated_at: Date;
    protocol: string;
    rdf_raw: string;
}