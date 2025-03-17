// src/types/mediaplan.ts

export interface PONumber {
    _id: string;
    name: string;
    value: number;
}

export interface EntityReference {
    _id: string;
    name: string;
}

export interface Budget {
    total: number;
    used: number;
    available: number;
}

export interface Mediaplan {
    _id: string;
    name: string;
    status: 'In Planning' | 'Draft' | 'For Approval';
    start_date: string;
    end_date: string;
    brand: EntityReference;
    budget: Budget;
    po_numbers: PONumber[];
    created_by?: EntityReference;
    created_at?: string;
    updated_at?: string;
}

export interface MediaplanFilter {
    search?: string;
    status?: string;
    start_date_before?: string;
    start_date_after?: string;
    brand_id?: string;
}