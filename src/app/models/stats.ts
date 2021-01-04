export interface StatsFilterForm {
    protocol?: string,
    users?: string[],
    tags?: string[]
}

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

export interface StatsPaginationData<T> {
    page: {
        size: number,
        page: number,
        totalRecords: number
    },
    data?: T[]
}