// src/types/mediaplan.ts

// Basic source type used across various dropdowns
export interface Source {
    abbreviation: string;
    category: string | null;
    value: string;
}

// Brand reference
export interface Brand {
    _id: string;
    name: string;
    logo?: string;
}

// Filter sources from API
export interface FilterSources {
    brands: Brand[];
    countries: Source[];
    subsegments: Source[];
    products: Source[];
    campaigntypes: Source[];
    languages: Source[];
}

// Budget information
export interface Budget {
    used: number;
    total: number;
    available: number;
}

// PO Number structure
export interface PONumber {
    _id: string;
    name: string;
    value: number;
}

// Entity reference (used for created_by and other references)
export interface EntityReference {
    _id: string;
    name: string;
}

// Mediaplan filter options
export interface MediaplanFilter {
    search?: string;
    status?: string;
    start_date_before?: string;
    start_date_after?: string;
    brand_id?: string;
    country?: string;
    created_by_me?: boolean;
    currently_running?: boolean;
}

// Mediaplan create request
export interface MediaplanCreate {
    name: string;
    status: 'In Planning' | 'Draft' | 'For Approval';
    start_date: string;
    end_date: string;
    brand: {
        _id: string;
        name?: string;
    };
    budget: {
        total: number;
        used?: number;
        available?: number;
    };
    po_numbers?: PONumber[];
}

// Complete Mediaplan object
export interface Mediaplan {
    _id: string;
    name: string;
    status: 'in_planning' | 'draft' | 'for_approval';
    start_date: string;
    end_date: string;
    brand: EntityReference;
    budget: Budget;
    po_numbers?: PONumber[];
    created_by: EntityReference;
    created_at: string;
    updated_at: string;
}

// API response for mediaplan list
export interface MediaplanListResponse {
    total_items: number;
    total_pages: number;
    current_page: number;
    items: Mediaplan[];
}

// Sources response type
export interface SourcesResponse {
    _id: string;
    version: string;
    timestamp: string;
    message: string;
    code: number;
    data: {
        subsegment?: Source[];
        product?: Source[];
        campaigntype?: Source[];
        language?: Source[];
        [key: string]: Source[] | undefined;
    };
}