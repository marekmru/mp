// src/types/lineitem.ts

/**
 * Represents a single Line Item based on the API schema.
 */
export interface Lineitem {
    _id: string; // Unique identifier of the Line Item.
    pid: string; // ID of the parent Project.
    mid?: string; // Mediaplan ID (Clarify purpose if needed)
    cid?: string; // Campaign ID (Added based on context, confirm if API provides)
    lineitem?: string; // (Clarify purpose if needed)
    lineitemname: string; // Name of the line item.
    product: string; // Product associated with the line item.
    phase: string; // Phase of the line item.
    goals: string; // Goal of the line item.
    targetingtactic: string; // Targeting tactic.
    creatives?: string[]; // Array of creative IDs (optional based on spec).
    created_at: string; // Line item creation timestamp.
    updated_at?: string | null; // Line item last update timestamp (optional).
    // Add any other fields returned by the API
}

/**
 * Represents the data structure needed to create a new Line Item.
 * Adjust fields based on the actual API requirements for POST requests.
 */
export interface LineitemCreate {
    // Required fields based on potential API needs
    lineitemname: string;
    product: string;
    phase: string;
    goals: string;
    targetingtactic: string;
    // Optional fields
    creatives?: string[];
    // Context IDs (pid, mid, cid) are usually part of the URL, not the body
}

/**
 * Represents the expected response when fetching a list of line items.
 * Based on the current Swagger spec, this is just an array of Lineitem.
 * If the API changes to be paginated, update this interface accordingly.
 */
export type LineitemListResponse = Lineitem[];

// If the API becomes paginated for line items:
/*
export interface LineitemListResponse {
  items: Lineitem[];
  total_items: number;
  total_pages: number;
  current_page: number;
}
*/

