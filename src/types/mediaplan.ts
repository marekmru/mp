// src/types/mediaplan.ts

// Basic source type used across various dropdowns
export interface Source {
    abbreviation: string;
    category: string | null;
    value: string;
}

// Brand reference
/*export interface Brand {
    _id: string;
    name: string;
    logo?: string;
}*/

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

export interface Brand {
    _id?: string;
    abbreviation: string;
    value: string;
    category?: string | null;
    logo?: string;
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


// Complete Mediaplan object
export interface Mediaplan {
    _id?: string;
    name: string;
    status: 'in_planning' | 'draft' | 'for_approval';
    start_date: string;
    end_date: string;
    brand: Brand;
    po_numbers: PONumber[];
    budget?: Budget;
    mediaplan_type: string; // Added mediaplan_type
    created_by?: EntityReference | string;
    created_at?: string;
    updated_at?: string;
}

// API response for mediaplan list
export interface MediaplanListResponse {
    total_items: number;
    total_pages: number;
    current_page: number;
    items: Mediaplan[];
}
