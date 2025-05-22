import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import customFetch from '@/helpers/customFetch';
import type { PONumber } from '@/types/mediaplan';

export interface PONumberCreatePayload {
    name: string;
    value: number;
    metadata?: Record<string, any>;
}

export interface PONumberUpdatePayload {
    name?: string;
    value?: number;
    metadata?: Record<string, any>;
}


export const usePoNumberStore = defineStore('poNumber', () => {
    const poNumbers = ref<PONumber[]>([]);
    const selectedPONumber = ref<PONumber | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const getPONumberById = computed(() => {
        return (id: string) => poNumbers.value.find(po => po._id === id);
    });

    const allPONumbers = computed(() => poNumbers.value);

    async function fetchPONumbers(): Promise<void> {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await customFetch('po') as PONumber[];
            poNumbers.value = response;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch PO Numbers';
            console.error('Error fetching PO Numbers:', err);
            poNumbers.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchPONumber(id: string): Promise<PONumber | null> {
        isLoading.value = true;
        error.value = null;
        selectedPONumber.value = null;
        try {
            const response = await customFetch(`po/${id}`) as PONumber;
            const index = poNumbers.value.findIndex(p => p._id === id);
            if (index !== -1) {
                poNumbers.value[index] = response;
            } else {
            }
            selectedPONumber.value = response;
            return response;
        } catch (err) {
            error.value = err instanceof Error ? err.message : `Failed to fetch PO Number with ID ${id}`;
            console.error(`Error fetching PO Number ${id}:`, err);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function createPONumber(payload: PONumberCreatePayload): Promise<PONumber | null> {
        isLoading.value = true;
        error.value = null;
        try {
            const requestBody: Record<string, any> = {
                name: payload.name,
                value: payload.value,
            };
            if (payload.metadata) {
                requestBody.metadata = payload.metadata;
            }

            const newPONumber = await customFetch('po', {
                method: 'POST',
                body: JSON.stringify(requestBody),
            }) as PONumber;

            poNumbers.value.push(newPONumber);
            return newPONumber;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create PO Number';
            console.error('Error creating PO Number:', err);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function updatePONumber(id: string, payload: PONumberUpdatePayload): Promise<PONumber | null> {
        isLoading.value = true;
        error.value = null;
        try {
            const updatedPONumber = await customFetch(`po/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            }) as PONumber;

            const index = poNumbers.value.findIndex(po => po._id === id);
            if (index !== -1) {
                poNumbers.value[index] = { ...poNumbers.value[index], ...updatedPONumber };
            }
            if (selectedPONumber.value?._id === id) {
                selectedPONumber.value = { ...selectedPONumber.value, ...updatedPONumber };
            }
            return updatedPONumber;
        } catch (err) {
            error.value = err instanceof Error ? err.message : `Failed to update PO Number with ID ${id}`;
            console.error(`Error updating PO Number ${id}:`, err);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function deletePONumber(id: string): Promise<boolean> {
        isLoading.value = true;
        error.value = null;
        try {
            await customFetch(`po/${id}`, {
                method: 'DELETE',
            });
            poNumbers.value = poNumbers.value.filter(po => po._id !== id);
            if (selectedPONumber.value?._id === id) {
                selectedPONumber.value = null;
            }
            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : `Failed to delete PO Number with ID ${id}`;
            console.error(`Error deleting PO Number ${id}:`, err);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        poNumbers,
        selectedPONumber,
        isLoading,
        error,
        allPONumbers,
        getPONumberById,
        fetchPONumbers,
        fetchPONumber,
        createPONumber,
        updatePONumber,
        deletePONumber,
    };
});