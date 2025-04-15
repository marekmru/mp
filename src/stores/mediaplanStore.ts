// src/stores/mediaplanStore.ts
import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import customFetch from '@/helpers/customFetch';
import type {
    FilterSources, Mediaplan, MediaplanFilter, MediaplanListResponse, SourcesResponse
} from "../types";

export const useMediaplanStore = defineStore('mediaplan', () => {
    // State
    const mediaplans = ref<Mediaplan[]>([]);
    const sources = ref<FilterSources>({
        brands: [],
        countries: [],
        subsegments: [],
        products: [],
        campaigntypes: [],
        languages: []
    });
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Pagination state
    const totalItems = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const perPage = ref(25);

    // Filter and sort state
    const filters = ref<MediaplanFilter>({
        search: '',
        status: '',
    });
    const sortBy = ref('updated_at');
    const sortOrder = ref<'asc' | 'desc'>('desc');

    // Getters
    const hasFilters = computed(() => {
        return !!(
            filters.value.search ||
            filters.value.status ||
            filters.value.brand_id ||
            filters.value.country ||
            filters.value.created_by_me ||
            filters.value.currently_running
        );
    });

    // Actions
    async function fetchMediaplans() {
        isLoading.value = true;
        error.value = null;
        console.log('fetchMediaplans')
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            queryParams.append('page', currentPage.value.toString());
            queryParams.append('per_page', perPage.value.toString());

            if (sortBy.value) {
                queryParams.append('sort', sortBy.value);
                queryParams.append('order', sortOrder.value);
            }

            // Add filter parameters if they exist
            if (Object.keys(filters.value).length > 0) {
                const filterObj: Record<string, any> = {};

                if (filters.value.search) filterObj.search = filters.value.search;
                if (filters.value.status) filterObj.status = filters.value.status;
                if (filters.value.brand_id) filterObj.brand_id = filters.value.brand_id;
                if (filters.value.start_date_after) filterObj.start_date_after = filters.value.start_date_after;
                if (filters.value.start_date_before) filterObj.start_date_before = filters.value.start_date_before;

                queryParams.append('filter', JSON.stringify(filterObj));
            }

            const url = `/mediaplans?${queryParams.toString()}`;
            const response = await customFetch(url) as MediaplanListResponse;

            mediaplans.value = response.items;
            totalItems.value = response.total_items;
            totalPages.value = response.total_pages;
            currentPage.value = response.current_page;

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred while fetching mediaplans';
            console.error('Error fetching mediaplans:', err);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchSources() {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await customFetch('/mediaplans/sources?type=overview') as SourcesResponse;

            if (response && response.data) {
                // Map the response to our sources structure
                if (response.data.subsegment) {
                    sources.value.subsegments = response.data.subsegment;
                }

                if (response.data.product) {
                    sources.value.products = response.data.product;
                }

                if (response.data.campaigntype) {
                    sources.value.campaigntypes = response.data.campaigntype;
                }

                if (response.data.language) {
                    sources.value.languages = response.data.language;
                    // Use languages as countries for this example
                    sources.value.countries = response.data.language;
                }

                // Mock brands data (adjust as needed based on your actual API)
                sources.value.brands = [
                    {_id: 'bmw', name: 'BMW'},
                    {_id: 'mini', name: 'Mini'}
                ];
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred while fetching sources';
            console.error('Error fetching sources:', err);
        } finally {
            isLoading.value = false;
        }
    }

    function setFilter(key: keyof MediaplanFilter, value: any) {
        filters.value = {...filters.value, [key]: value};

        // Reset to first page when filter changes
        currentPage.value = 0;
    }

    function clearFilters() {
        filters.value = {
            search: '',
            status: '',
        };

        // Reset to first page
        currentPage.value = 0;
    }

    function setSorting(field: string, order: 'asc' | 'desc') {
        sortBy.value = field;
        sortOrder.value = order;

        // Fetch mediaplans with new sorting
        fetchMediaplans();
    }

    function setPage(page: number) {
        currentPage.value = page;
        fetchMediaplans();
    }

    // Initialize data
    function init() {
        fetchSources();
        fetchMediaplans();
    }

    return {
        // State
        mediaplans,
        sources,
        isLoading,
        error,
        totalItems,
        totalPages,
        currentPage,
        perPage,
        filters,
        sortBy,
        sortOrder,

        // Getters
        hasFilters,

        // Actions
        fetchMediaplans,
        fetchSources,
        setFilter,
        clearFilters,
        setSorting,
        setPage,
        init
    };
});