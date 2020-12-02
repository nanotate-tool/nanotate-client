/**
 * defines the model of workflow entity
 */
export interface Workflow {
    id: string;
    protocol: string;
    label: string
    description: string;
    author: string;
    nanopubs: string[];
    permissions: { read: string[], update: string[], delete: string[] };
    rdf: any;
    created_at: Date;
    updated_at: Date;
}

/**
 * defines the data for request of workflow creation 
 */
export interface WorkflowRequest {
    id?: string;
    protocol: string;
    description: string;
    author: string;
    nanopubs: string[];

}