export interface EntryTypeResponse {
    data: EntryType[];
}

export interface EntryType {
    id: number;
    name: string;
    abbreviation: string;
    status: number;
}
