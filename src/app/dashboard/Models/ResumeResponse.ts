export interface ResumeResponse {
    data: Resume[];
}

export interface Resume {
    month:        string[];
    total_amount: number[];
}
