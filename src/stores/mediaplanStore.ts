// File: src/stores/mediaplanStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import customFetch from '@/helpers/customFetch';
import type {
    FilterSources,
    Mediaplan,
    MediaplanFilter,
    MediaplanListResponse,
    SourcesResponse
} from '@/types';

export const useMediaplanStore = defineStore('mediaplan', () => {
    // --- State ---
    const sources = ref<FilterSources>({
        brands: [
            { _id: 'bmw', name: 'BMW' },
            { _id: 'mini', name: 'MINI' }
        ],
        countries: [
            { abbreviation: 'DE', value: 'Germany', category: null },
            { abbreviation: 'AT', value: 'Austria', category: null },
            // …other mock countries…
        ],
        subsegments: [],
        products: [],
        campaigntypes: [],
        languages: []
    });
    const mediaplans  = ref<Mediaplan[]>([]);
    const isLoading   = ref(false);
    const error       = ref<string | null>(null);
    const selectedMediaplan = ref<Mediaplan | null>(null)


    // Pagination
    const totalItems  = ref(0);
    const totalPages  = ref(0);
    const currentPage = ref(0);
    const perPage     = ref(10);

    // Filters & Sorting
    const filters   = ref<MediaplanFilter>({ search: '', status: '' });
    const sortBy    = ref('updated_at');
    const sortOrder = ref<'asc' | 'desc'>('desc');

    const hasFilters = computed(() =>
        !!(
            filters.value.search ||
            filters.value.status ||
            filters.value.brand_id ||
            filters.value.country
        )
    );

    // --- Actions ---
    /** Load real source‐lists (when API is available) */
    async function fetchSources() {
        isLoading.value = true;
        try {
            const res = await customFetch('/mediaplans/sources?type=overview') as SourcesResponse;
            sources.value = {
                brands:       res.data.brand       ?? [],
                countries:    res.data.country     ?? [],
                subsegments:  res.data.subsegment  ?? [],
                products:     res.data.product     ?? [],
                campaigntypes:res.data.campaigntype ?? [],
                languages:    res.data.language    ?? []
            };
        } catch {
            // keep the mock data
        } finally {
            isLoading.value = false;
        }
    }
// Inside defineStore in mediaplanStore.ts


    /**
     * Fetch a single Mediaplan by ID
     */
    async function fetchMediaplan(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const res = await customFetch(`/mediaplans/${id}`) as Mediaplan
            selectedMediaplan.value = res
        } catch (err) {
            selectedMediaplan.value = null
            error.value = err instanceof Error ? err.message : 'Error fetching mediaplan'
        } finally {
            isLoading.value = false
        }
    }
    /** Fetch paginated & filtered list */
    async function fetchMediaplans() {
        isLoading.value = true;
        error.value = null;
        try {
            const params = new URLSearchParams({
                page:        currentPage.value.toString(),
                per_page:    perPage.value.toString(),
                sort:        sortBy.value,
                order:       sortOrder.value,
            });

            // apply filters
            const active: Record<string, any> = {};
            Object.entries(filters.value).forEach(([k, v]) => {
                if (v !== '' && v != null) {
                    active[k] = v;
                }
            });
            if (Object.keys(active).length) {
                params.append('filter', JSON.stringify(active));
            }

            const url = `/mediaplans?${params.toString()}`;
            const resp = await customFetch(url) as MediaplanListResponse;

            mediaplans.value  = resp.items;
            totalItems.value  = resp.total_items;
            totalPages.value  = resp.total_pages;
            currentPage.value = resp.current_page;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error fetching mediaplans';
            mediaplans.value = [];
            totalItems.value = totalPages.value = 0;
        } finally {
            isLoading.value = false;
        }
    }

    /** Update a single filter and reload */
    function setFilter(key: keyof MediaplanFilter, value: unknown) {
        filters.value = { ...filters.value, [key]: value };
        currentPage.value = 0;
        fetchMediaplans();
    }

    /** Clear all filters back to defaults */
    function clearFilters() {
        filters.value = { search: '', status: '' };
        currentPage.value = 0;
        fetchMediaplans();
    }

    /** Change sorting and reload */
    function setSorting(field: string, order: 'asc' | 'desc') {
        sortBy.value    = field;
        sortOrder.value = order;
        fetchMediaplans();
    }

    /** Change page and reload */
    function setPage(page: number) {
        currentPage.value = page;
        fetchMediaplans();
    }

    /** Initialize both sources and list */
    function init() {
        fetchSources();
        fetchMediaplans();
    }

    return {
        // state
        sources,
        mediaplans,
        selectedMediaplan,
        isLoading,
        error,
        totalItems,
        totalPages,
        currentPage,
        perPage,
        filters,
        sortBy,
        sortOrder,
        hasFilters,
        // actions
        fetchSources,
        fetchMediaplans,
        fetchMediaplan,
        setFilter,
        clearFilters,
        setSorting,
        setPage,
        init
    }
});