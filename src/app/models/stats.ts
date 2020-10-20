export interface CounterStats {
    label: string; count: number
}

export interface EssentialStats {
    ontologies: CounterStats[],
    tags: CounterStats[],
    terms: {
        related: [
            { term: string, uris: CounterStats[] }
        ],
        used: CounterStats[]
    }
}