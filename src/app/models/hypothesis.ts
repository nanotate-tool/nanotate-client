export interface HypothesisGroup {
    name: string;
    id: string;
    public: boolean;
    url: string;
}

export interface HypothesisProfile {
    userid: string;
    authority: string;
    groups: HypothesisGroup[];
    features: { client_search_input: boolean, embed_cachebuster: boolean, client_display_names: boolean };
    preferences: any;
    user_info: { display_name: string };
}