import { ref } from 'vue';
import type { Lineitem, LineitemListResponse } from '@/types/lineitem';

export function useLineitemStore() {
  const lineitems = ref<Lineitem[]>([]);
  const totalItems = ref(0);
  const totalPages = ref(0);
  const currentPage = ref(1);
  const perPage = ref(10);
  const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([]);

  async function fetchLineitems() {
    // Fetch line items from API
    const response: LineitemListResponse = await fetch('/api/lineitems').then(res => res.json());
    lineitems.value = response;

    totalItems.value = response.length;
    totalPages.value = 1; // No real pagination yet
    currentPage.value = 1;
  }

  return {
    lineitems,
    fetchLineitems,
    totalItems,
    totalPages,
    currentPage,
    perPage,
    sortBy,
  };
}
