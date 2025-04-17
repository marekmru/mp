// src/types/campaign.ts (Beispiel - erstellen oder anpassen)

export interface Campaign {
    _id: string;
    campaignname: string;
    pid: string; // Project ID
    campaigndetail?: string | null;
    campaigntype: string;
    created_at: string;
    language: string;
    product: string;
    subsegment: string;
    type: string; // z.B. display, video
    updated_at?: string | null;
    // Füge weitere Felder hinzu, falls von der API geliefert
}

export interface CampaignListResponse {
    items: Campaign[];
    total_items: number;
    total_pages: number;
    current_page: number; // 0-basiert
}

// Optional: Typ für das Erstellen einer Kampagne (aus Spec)
export interface CampaignCreate {
    campaignname: string;
    pid: string;
    campaigndetail?: string | null;
    campaigntype: string;
    language?: string;
    product?: string;
    subsegment?: string;
    type?: string;
}