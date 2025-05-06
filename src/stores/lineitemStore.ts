// src/stores/lineItemStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import customFetch from '@/helpers/customFetch'; // Adjust path if necessary
import type {
    Lineitem,
    LineitemListResponse,
    LineitemCreate,
} from '@/types/lineitem'; // Adjust path if necessary

export const useLineitemStore = defineStore('lineItem', () => {
    // --- State ---
    const lineitems = ref<Lineitem[]>([]);
    const selectedLineitem = ref<Lineitem | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // New state variables for pagination and sorting
    const totalItems = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const perPage = ref(10);
    const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([]);

    // Store context IDs for potential reload actions or context checking
    const currentContextMediaplanId = ref<string | null>(null);
    const currentContextProjectId = ref<string | null>(null);
    const currentContextCampaignId = ref<string | null>(null);

    // --- Actions ---

    /**
     * Fetches the list of Line Items for a specific Campaign within a Project and Mediaplan.
     * NOTE: Based on the current Swagger spec, this endpoint returns an array, not a paginated response.
     * If the API changes to support pagination, this function and the state need updates.
     * @param {string} mediaplanId - The ID of the Mediaplan.
     * @param {string} projectId - The ID of the Project.
     * @param {string} campaignId - The ID of the Campaign.
     */
    async function fetchLineitems(
        mediaplanId: string,
        projectId: string,
        campaignId: string
    ) {
        if (!mediaplanId || !projectId || !campaignId) {
            error.value =
                'Mediaplan ID, Project ID, or Campaign ID is missing for fetching line items.';
            console.error(error.value);
            lineitems.value = [];
            return;
        }

        // Store context
        currentContextMediaplanId.value = mediaplanId;
        currentContextProjectId.value = projectId;
        currentContextCampaignId.value = campaignId;

        isLoading.value = true;
        error.value = null;
        try {
            // Construct the API URL
            const url = `/mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}/lineitems`;

            // Make the API call
            // Expecting LineitemListResponse which is currently typed as Lineitem[]
            const response = (await customFetch(url)) as LineitemListResponse;

            // Validate response format (expecting an array)
            if (Array.isArray(response)) {
                lineitems.value = response.map(item => ({
                    ...item,
                    // Add context IDs if not provided by API but needed locally
                    mid: mediaplanId,
                    pid: projectId, // pid should already be there from API
                    cid: campaignId
                }));
                totalItems.value = response.length;
                totalPages.value = 1; // No real pagination yet
                currentPage.value = 0;
            } else {
                console.warn(
                    'Received unexpected response format for line items, expected an array.',
                    response
                );
                lineitems.value = []; // Reset state on unexpected format
                error.value = 'Unexpected response format from server.';
            }
        } catch (err) {
            error.value =
                err instanceof Error
                    ? err.message
                    : 'An error occurred while fetching line items';
            console.error('Error fetching line items:', err);
            lineitems.value = []; // Reset state on error
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Fetches details for a single Line Item. (Optional but recommended)
     * @param {string} mediaplanId - The ID of the Mediaplan.
     * @param {string} projectId - The ID of the Project.
     * @param {string} campaignId - The ID of the Campaign.
     * @param {string} lineItemId - The ID of the Line Item to fetch.
     */
    async function fetchLineitem(
        mediaplanId: string,
        projectId: string,
        campaignId: string,
        lineItemId: string
    ) {
        if (!mediaplanId || !projectId || !campaignId || !lineItemId) {
            error.value = 'Missing IDs to fetch line item details.';
            console.error(error.value);
            selectedLineitem.value = null;
            return;
        }
        isLoading.value = true; // Consider a separate loading state if needed
        error.value = null;
        selectedLineitem.value = null; // Reset before fetching
        try {
            const url = `/mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}/lineitems/${lineItemId}`;
            const response = (await customFetch(url)) as Lineitem;
            selectedLineitem.value = {
                ...response,
                // Add context IDs if not provided by API but needed locally
                mid: mediaplanId,
                pid: projectId, // pid should already be there from API
                cid: campaignId
            };
        } catch (err) {
            error.value =
                err instanceof Error
                    ? err.message
                    : 'Failed to load line item details';
            console.error(`Error fetching line item ${lineItemId}:`, err);
            selectedLineitem.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Creates a new Line Item for a specific Campaign. (Optional but recommended)
     * @param {string} mediaplanId - The ID of the Mediaplan.
     * @param {string} projectId - The ID of the Project.
     * @param {string} campaignId - The ID of the Campaign.
     * @param {LineitemCreate} lineItemData - The data for the new Line Item.
     * @returns {Promise<Lineitem | null>} The created Line Item or null on failure.
     */
    async function createLineitem(
        mediaplanId: string,
        projectId: string,
        campaignId: string,
        lineItemData: LineitemCreate
    ): Promise<Lineitem | null> {
        if (!mediaplanId || !projectId || !campaignId) {
            error.value = 'Missing IDs for creating line item.';
            console.error(error.value);
            return null;
        }
        isLoading.value = true; // Consider a separate loading state
        error.value = null;
        try {
            const url = `/mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}/lineitems`;
            const newLinteItem = (await customFetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lineItemData),
            })) as Lineitem;

            // Optional: Refetch the list or manually add the new item
            // For simplicity, refetching is often easier unless performance is critical
            await fetchLineitems(mediaplanId, projectId, campaignId);

            return {
                ...newLinteItem,
                // Add context IDs if not provided by API but needed locally
                mid: mediaplanId,
                pid: projectId, // pid should already be there from API
                cid: campaignId
            };
        } catch (err) {
            error.value =
                err instanceof Error ? err.message : 'Failed to create line item';
            console.error('Error creating line item:', err);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    // --- Return Store API ---
    return {
        // State
        lineitems,
        selectedLineitem,
        isLoading,
        error,
        currentContextMediaplanId, // Expose context if needed externally
        currentContextProjectId,
        currentContextCampaignId,

        totalItems,
        totalPages,
        currentPage,
        perPage,
        sortBy,

        // Actions
        fetchLineitems,
        fetchLineitem, // Expose if needed
        createLineitem, // Expose if needed
    };
});
