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
    rdf_raw: any;
    publication_info: PublicationInfo,
    permissions: { read: string[], update: string[], delete: string[] }
    workflows: { id: string, label: string, description: string }[];
    hasWorkflows: boolean;
}

/**
 * contiene la informacion de la publicacion remota
 */
export interface PublicationInfo {
    nanopub_uri: string
    artifact_code: string
}