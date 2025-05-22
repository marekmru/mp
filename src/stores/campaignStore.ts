// src/stores/campaignStore.ts (NEUE DATEI)
import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import customFetch from '@/helpers/customFetch'; // Pfad prüfen
import type {Campaign, CampaignListResponse, CampaignCreate} from '@/types/campaign'; // Pfade/Typen prüfen

export const useCampaignStore = defineStore('campaign', () => {
    // State
    const campaigns = ref<Campaign[]>([]);
    const selectedCampaign = ref<Campaign | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Pagination state
    const totalItems = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0); // 0-basiert
    const perPage = ref(15);    // Standard Items pro Seite

    // Store context IDs for pagination/reload actions
    const currentContextMediaplanId = ref<string | null>(null);
    const currentContextProjectId = ref<string | null>(null);

    // Optional: Sorting state
    // const sortBy = ref('created_at');
    // const sortOrder = ref<'asc' | 'desc'>('desc');

    // --- Actions ---

    /**
     * Lädt eine Liste von Kampagnen für ein bestimmtes Projekt innerhalb eines Mediaplans.
     * Geht von einer paginierten API-Antwort aus.
     */
    async function fetchCampaigns(mediaplanId: string, projectId: string) {
        if (!mediaplanId || !projectId) {
            error.value = "Mediaplan ID or Project ID is missing for fetching campaigns.";
            console.error(error.value);
            campaigns.value = [];
            totalItems.value = 0;
            totalPages.value = 0;
            currentPage.value = 0; // Reset
            return;
        }
        // Store context for pagination actions
        currentContextMediaplanId.value = mediaplanId;
        currentContextProjectId.value = projectId;

        isLoading.value = true;
        error.value = null;
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', currentPage.value.toString());
            queryParams.append('per_page', perPage.value.toString());
            // Optional: Add sorting params
            // queryParams.append('sort', sortBy.value);
            // queryParams.append('order', sortOrder.value);

            const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns?${queryParams.toString()}`;

            // Annahme: API liefert paginierte Antwort
            const response = await customFetch(url) as CampaignListResponse;

            if (response && response.items) {
                campaigns.value = response.items;
                totalItems.value = response.total_items;
                totalPages.value = response.total_pages;
                // Stelle sicher, dass current_page vom Backend mit dem lokalen State übereinstimmt
                // Es ist sicherer, den Wert vom Backend zu übernehmen.
                currentPage.value = response.current_page;
            } else {
                // Fallback, falls die API doch nur ein Array liefert (oder unerwartete Antwort)
                console.warn("Received unexpected response format for campaigns, expected paginated object.", response);
                if (Array.isArray(response)) {
                    campaigns.value = response as Campaign[];
                    totalItems.value = campaigns.value.length;
                    totalPages.value = 1;
                    currentPage.value = 0;
                } else {
                    campaigns.value = [];
                    totalItems.value = 0;
                    totalPages.value = 0;
                    currentPage.value = 0;
                }
            }

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred while fetching campaigns';
            console.error('Error fetching campaigns:', err);
            campaigns.value = [];
            totalItems.value = 0;
            totalPages.value = 0; // Reset state on error
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Lädt die Details einer einzelnen Kampagne.
     */
    async function fetchCampaign(mediaplanId: string, projectId: string, campaignId: string) {
        if (!mediaplanId || !projectId || !campaignId) {
            error.value = "Missing IDs to fetch campaign details.";
            console.error(error.value);
            selectedCampaign.value = null;
            return;
        }
        isLoading.value = true; // Generisches Loading oder separates?
        error.value = null;
        selectedCampaign.value = null; // Reset
        try {
            const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}`;
            selectedCampaign.value = await customFetch(url) as Campaign;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load campaign details';
            console.error(`Error fetching campaign ${campaignId}:`, err);
            selectedCampaign.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Setzt die aktuelle Seite und lädt die Kampagnen neu.
     * Verwendet die gespeicherten Kontext-IDs.
     */
    function setPage(page: number) {
        if (currentContextMediaplanId.value && currentContextProjectId.value && page >= 0) {
            currentPage.value = page;
            fetchCampaigns(currentContextMediaplanId.value, currentContextProjectId.value);
        } else {
            console.error("Cannot set page, context IDs are missing or page is invalid.");
        }
    }

    /**
     * Setzt die Anzahl der Items pro Seite, setzt auf Seite 0 zurück und lädt neu.
     * Verwendet die gespeicherten Kontext-IDs.
     */
    function setPerPage(newPerPage: number) {
        if (currentContextMediaplanId.value && currentContextProjectId.value && newPerPage > 0) {
            perPage.value = newPerPage;
            currentPage.value = 0; // Reset to first page
            fetchCampaigns(currentContextMediaplanId.value, currentContextProjectId.value);
        } else {
            console.error("Cannot set perPage, context IDs are missing or value is invalid.");
        }
    }

    // Optional: setSorting(...) implementieren, falls benötigt

    /**
     * Erstellt eine neue Kampagne.
     */
    async function createCampaign(mediaplanId: string, projectId: string, campaignData: CampaignCreate): Promise<Campaign | null> {
        if (!mediaplanId || !projectId) {
            error.value = "Missing IDs for creating campaign.";
            console.error(error.value);
            return null;
        }
        isLoading.value = true;
        error.value = null;
        try {
            const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns`;
            const newCampaign = await customFetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(campaignData),
            }) as Campaign;

            // Optional: Liste neu laden oder die neue Kampagne manuell hinzufügen
            // fetchCampaigns(mediaplanId, projectId); // Einfachste Variante
            return newCampaign;

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create campaign';
            console.error('Error creating campaign:', err);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        // State
        campaigns,
        selectedCampaign,
        isLoading,
        error,
        totalItems,
        totalPages,
        currentPage,
        perPage,
        // Optional: Sortierung
        // sortBy,
        // sortOrder,

        // Actions
        fetchCampaigns,
        fetchCampaign,
        setPage,
        setPerPage,
        createCampaign,
        // Optional: setSorting
    };
});