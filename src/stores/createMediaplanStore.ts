// src/stores/createMediaplanStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PONumber } from '@/types/mediaplan';
import customFetch from "../helpers/customFetch.ts";
import type {Mediaplan} from "../types";
// useSourcesStore is no longer needed here directly for brands
// import { useSourcesStore } from './sourcesStore';

export const useCreateMediaplanStore = defineStore('createMediaplan', () => {
    // const sourcesStore = useSourcesStore(); // Not needed if brands are handled in component

    // State
    // const brands = ref<Brand[]>([]); // Removed
    const poNumbers = ref<PONumber[]>([]);
    const isLoading = ref(false); // This can be for PO numbers fetching and mediaplan creation
    const error = ref<string | null>(null);

    // Actions
    // async function fetchBrands() { ... } // Removed

    async function fetchPONumbers() {
        isLoading.value = true;
        error.value = null;

        try {
            // In a real application, this would be an API call to get PO numbers
            // const response = await customFetch('/po-numbers');
            // poNumbers.value = response;

            // For demo purposes, use mock data
            poNumbers.value = [
                { _id: 'po-1', name: 'PO12345', value: 10000 },
                { _id: 'po-2', name: 'PO67890', value: 15000 },
                { _id: 'po-3', name: 'PO24680', value: 20000 },
            ];
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error fetching PO numbers';
            console.error('Error fetching PO numbers:', err);
        } finally {
            isLoading.value = false;
        }
    }

    async function createPO(poData: Omit<PONumber, '_id'> & { metadata?: any }): Promise<PONumber> {
        isLoading.value = true;
        error.value = null;

        try {
            // In a real application, this would be an API call to create a PO
            // const response = await customFetch('/po-numbers', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(poData),
            // });
            // return response;

            // For demo purposes, simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const newPO: PONumber = {
                _id: `po-${Date.now()}`,
                name: poData.name,
                value: poData.value
            };

            poNumbers.value.push(newPO);

            return newPO;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error creating PO';
            console.error('Error creating PO:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    // Mediaplan creation logic (example, can be expanded)
    async function createMediaplan(mediaplanData: Mediaplan): Promise<Mediaplan | null> {
        isLoading.value = true;
        error.value = null;
        try {
            // Actual API call to POST /mediaplans
            const newMediaplan = await customFetch('mediaplans', {
                method: 'POST',
                body: JSON.stringify(mediaplanData),
            }) as Mediaplan; // Assuming the response is the created Mediaplan object
            return newMediaplan;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error creating mediaplan';
            console.error('Error creating mediaplan:', err);
            // Optionally, you might want to emit an error event or rethrow
            // depending on how you want to handle errors globally vs. locally
            return null; // Or throw err;
        } finally {
            isLoading.value = false;
        }
    }


    return {
        // State
        poNumbers,
        isLoading,
        error,

        // Actions
        fetchPONumbers,
        createPO,
        createMediaplan, // Added for completeness if store handles creation
    };
});