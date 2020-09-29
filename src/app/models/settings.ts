/**
 * contiene las configuraciones para la api de nanopublicaciones
 */
export interface NanoPubApiConfig{
    /**
     *  url de la api
     */
    apiUrl:string;
    /**
     *  grupo de ontologias permitidas
     */
    ontologies:string[];
    /**
     * tags permitidas 
     */
    tags:string[];
}