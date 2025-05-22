import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import customFetch from '@/helpers/customFetch';
import type {
    Mediaplan,
    MediaplanFilter,
    Brand,
    Source
} from '@/types';
import {useSourcesStore} from './sourcesStore';

interface ActualMediaplanListResponse {
    _id?: string;
    version?: string;
    timestamp?: string;
    code?: number;
    message?: string;
    data: Mediaplan[];
    count?: number;
    page?: number;
    page_count?: number;
    per_page?: number;
    total_count?: number;

    items?: Mediaplan[];
    total_items?: number;
    total_pages?: number;
    current_page?: number;
}


export const useMediaplanStore = defineStore('mediaplan', () => {
    const sourcesStore = useSourcesStore();

    const mediaplans = ref<Mediaplan[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const selectedMediaplan = ref<Mediaplan | null>(null);

    const totalItems = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const perPage = ref(10);

    const filters = ref<MediaplanFilter>({search: '', status: ''});
    const sortBy = ref('updated_at');
    const sortOrder = ref<'asc' | 'desc'>('desc');

    const hasFilters = computed(() =>
        !!(
            filters.value.search ||
            filters.value.status ||
            filters.value.brand_id ||
            filters.value.country
        )
    );

    const overviewFilterSources = computed(() => ({
        brands: (sourcesStore.getSourceList('brand') as Brand[] | undefined) || [],
        countries: (sourcesStore.getSourceList('country') as Source[] | undefined) || [],
        subsegments: (sourcesStore.getSourceList('subsegment') as Source[] | undefined) || [],
        products: (sourcesStore.getSourceList('product') as Source[] | undefined) || [],
        campaigntypes: (sourcesStore.getSourceList('campaigntype') as Source[] | undefined) || [],
        languages: (sourcesStore.getSourceList('language') as Source[] | undefined) || [],
    }));

    async function fetchMediaplan(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await customFetch(`mediaplans/${id}`) as Mediaplan;
            selectedMediaplan.value = (res as any).data || res;
        } catch (err) {
            selectedMediaplan.value = null;
            error.value = err instanceof Error ? err.message : 'Error fetching mediaplan';
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchMediaplans() {
        isLoading.value = true;
        error.value = null;
        try {
            const params = new URLSearchParams({
                page: currentPage.value.toString(),
                per_page: perPage.value.toString(),
                sort: sortBy.value,
                order: sortOrder.value,
            });

            const active: Record<string, any> = {};
            Object.entries(filters.value).forEach(([k, v]) => {
                if (v !== '' && v != null) {
                    active[k] = v;
                }
            });
            if (Object.keys(active).length) {
                params.append('filter', JSON.stringify(active));
            }

            const url = `mediaplans?${params.toString()}`;
            const resp = await customFetch(url) as ActualMediaplanListResponse;

            mediaplans.value = resp.data || resp.items || [];
            totalItems.value = resp.total_count ?? resp.total_items ?? mediaplans.value.length;
            totalPages.value = resp.page_count ?? resp.total_pages ?? 1;
            currentPage.value = resp.page ?? resp.current_page ?? 0;
            if (resp.per_page) {
                perPage.value = resp.per_page;
            }

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error fetching mediaplans';
            mediaplans.value = [];
            totalItems.value = totalPages.value = 0;
        } finally {
            isLoading.value = false;
        }
    }

    function setFilter(key: keyof MediaplanFilter, value: unknown) {
        filters.value = {...filters.value, [key]: value};
        currentPage.value = 0;
        fetchMediaplans();
    }

    function clearFilters() {
        filters.value = {search: '', status: ''};
        currentPage.value = 0;
        fetchMediaplans();
    }

    function setSorting(field: string, order: 'asc' | 'desc') {
        sortBy.value = field;
        sortOrder.value = order;
        fetchMediaplans();
    }

    function setPage(page: number) {
        currentPage.value = page;
        fetchMediaplans();
    }

    async function init() {
        await sourcesStore.fetchSources('creation', 'mediaplan');
        await fetchMediaplans();
    }

    return {
        overviewFilterSources,
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
        fetchMediaplans,
        fetchMediaplan,
        setFilter,
        clearFilters,
        setSorting,
        setPage,
        init
    };
});