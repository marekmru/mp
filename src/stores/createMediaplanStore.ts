// src/stores/createMediaplanStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import customFetch from '@/helpers/customFetch';
import type { Brand, PONumber } from '@/types/mediaplan';

export const useCreateMediaplanStore = defineStore('createMediaplan', () => {
  // State
  const brands = ref<Brand[]>([]);
  const poNumbers = ref<PONumber[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchBrands() {
    isLoading.value = true;
    error.value = null;

    try {
      // In a real application, this would be an API call to get brands
      // const response = await customFetch('/brands');
      // brands.value = response;

      // For demo purposes, use mock data
      brands.value = [
        { _id: 'bmw', name: 'BMW' },
        { _id: 'mini', name: 'MINI' },
      ];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching brands';
      console.error('Error fetching brands:', err);
    } finally {
      isLoading.value = false;
    }
  }

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
      
      // Create a new PO object with a generated ID
      const newPO: PONumber = {
        _id: `po-${Date.now()}`,
        name: poData.name,
        value: poData.value
      };
      
      // Add to the store
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

  return {
    // State
    brands,
    poNumbers,
    isLoading,
    error,

    // Actions
    fetchBrands,
    fetchPONumbers,
    createPO
  };
});