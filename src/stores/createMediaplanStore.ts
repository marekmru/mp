// src/stores/createMediaplanStore.ts
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import customFetch from '@/helpers/customFetch';
import type { MediaplanCreate, Brand, PONumber } from '@/types/mediaplan';

export const useCreateMediaplanStore = defineStore('createMediaplan', () => {
    // State
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const brands = ref<Brand[]>([]);
    const poNumbers = ref<PONumber[]>([]);
    const dialogVisible = ref(false);

    // Form data with default values
    const formData = reactive<MediaplanCreate>({
        name: '',
        status: 'Draft',
        start_date: '',
        end_date: '',
        brand: {
            _id: '',
        },
        budget: {
            total: 0,
            used: 0,
            available: 0
        },
        po_numbers: []
    });

    // Actions
    async function fetchBrands() {
        isLoading.value = true;
        error.value = null;

        try {
            // Mock data for development
            brands.value = [
                { _id: 'bmw', name: 'BMW' },
                { _id: 'mini', name: 'MINI' }
            ];

            // In production, use the API
            // const response = await customFetch('/brands');
            // brands.value = response.data || [];
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch brands';
            console.error('Error fetching brands:', err);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchPONumbers() {
        isLoading.value = true;
        error.value = null;

        try {
            // Mock data for development
            poNumbers.value = [
                { _id: 'po1', name: '4700551823', value: 1500 },
                { _id: 'po2', name: '4700551911', value: 2500 },
                { _id: 'po3', name: '4700552045', value: 3500 }
            ];

            // In production, use the API
            // const response = await customFetch('/po-numbers');
            // poNumbers.value = response.data || [];
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch PO numbers';
            console.error('Error fetching PO numbers:', err);
        } finally {
            isLoading.value = false;
        }
    }

    async function createMediaplan(data: MediaplanCreate): Promise<string> {
        isLoading.value = true;
        error.value = null;

        try {
            console.log('Creating mediaplan with data:', data);

            // In production, use the API
            // const response = await customFetch('/mediaplans', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(data),
            // });
            // return response._id;

            // For development, return a mock ID
            return 'mock-mediaplan-id-' + Date.now();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create mediaplan';
            console.error('Error creating mediaplan:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    function resetForm() {
        Object.assign(formData, {
            name: '',
            status: 'Draft',
            start_date: '',
            end_date: '',
            brand: {
                _id: '',
            },
            budget: {
                total: 0,
                used: 0,
                available: 0
            },
            po_numbers: []
        });
    }

    function showDialog() {
        dialogVisible.value = true;
    }

    function hideDialog() {
        dialogVisible.value = false;
        resetForm();
    }

    return {
        // State
        isLoading,
        error,
        brands,
        poNumbers,
        formData,
        dialogVisible,

        // Actions
        fetchBrands,
        fetchPONumbers,
        createMediaplan,
        resetForm,
        showDialog,
        hideDialog
    };
});