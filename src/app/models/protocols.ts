import { SiteMetaData } from './site_metadata';

export interface Protocol {
    uri: string
    title: string
    max_nanopubs: number;
    site_data?: SiteMetaData;
}