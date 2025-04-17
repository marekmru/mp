// src/stores/mediaplanStore.ts
import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import customFetch from '@/helpers/customFetch'; // Pfad prüfen
import type {
    FilterSources, Mediaplan, MediaplanFilter, MediaplanListResponse, SourcesResponse
} from "../types"; // Pfad prüfen

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
    const isLoading = ref(false); // Generisches Loading für Listen/Quellen
    const error = ref<string | null>(null); // Generischer Fehler

    // *** NEU: State für das einzelne Mediaplan-Detail ***
    const selectedMediaplan = ref<Mediaplan | null>(null);
    // *** Optional: Separates Loading/Error für Detail ***
    // const isLoadingDetail = ref(false);
    // const errorDetail = ref<string | null>(null);


    // Pagination state
    const totalItems = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const perPage = ref(10); // Standardwert konsistent halten

    // Filter and sort state
    const filters = ref<MediaplanFilter>({
        search: '',
        status: '',
    });
    const sortBy = ref('updated_at');
    const sortOrder = ref<'asc' | 'desc'>('desc');

    // Getters
    const hasFilters = computed(() => {
        // Überprüft, ob relevante Filter aktiv sind
        return !!(
            filters.value.search ||
            filters.value.status ||
            filters.value.brand_id ||
            filters.value.country ||
            filters.value.created_by_me ||
            filters.value.currently_running ||
            filters.value.start_date_after ||
            filters.value.start_date_before
        );
    });

    // Actions
    async function fetchMediaplans() {
        isLoading.value = true;
        error.value = null;
        // console.log('fetchMediaplans'); // Logging kann drin bleiben
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', currentPage.value.toString());
            queryParams.append('per_page', perPage.value.toString());

            if (sortBy.value) {
                queryParams.append('sort', sortBy.value);
                queryParams.append('order', sortOrder.value);
            }

            const activeFilters: Record<string, any> = {};
            for (const key in filters.value) {
                const filterKey = key as keyof MediaplanFilter;
                if (filters.value[filterKey] !== '' && filters.value[filterKey] !== null && filters.value[filterKey] !== undefined) {
                    if (typeof filters.value[filterKey] === 'boolean') {
                        activeFilters[filterKey] = String(filters.value[filterKey]);
                    } else {
                        activeFilters[filterKey] = filters.value[filterKey];
                    }
                }
            }
            if (Object.keys(activeFilters).length > 0) {
                queryParams.append('filter', JSON.stringify(activeFilters));
            }

            const url = `/mediaplans?${queryParams.toString()}`;
            const response = await customFetch(url) as MediaplanListResponse;

            mediaplans.value = response.items;
            totalItems.value = response.total_items;
            totalPages.value = response.total_pages;
            currentPage.value = response.current_page;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred while fetching mediaplans';
            error.value = message;
            console.error('Error fetching mediaplans:', err);
            // Reset state on error
            mediaplans.value = [];
            totalItems.value = 0;
            totalPages.value = 0;
            // currentPage nicht unbedingt zurücksetzen, evtl. will der User es nochmal versuchen
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchSources() {
        // Diese Funktion bleibt unverändert
        isLoading.value = true; // Oder separates Loading für Quellen?
        error.value = null;
        try {
            const response = await customFetch('/mediaplans/sources?type=overview') as SourcesResponse;
            if (response && response.data) {
                sources.value.subsegments = response.data.subsegment ?? [];
                sources.value.products = response.data.product ?? [];
                sources.value.campaigntypes = response.data.campaigntype ?? [];
                sources.value.languages = response.data.language ?? [];
                sources.value.countries = response.data.language ?? []; // Annahme beibehalten
                sources.value.brands = [ // Mock-Daten beibehalten
                    {_id: 'bmw', name: 'BMW'},
                    {_id: 'mini', name: 'Mini'}
                ];
            } else {
                sources.value = {
                    brands: [],
                    countries: [],
                    subsegments: [],
                    products: [],
                    campaigntypes: [],
                    languages: []
                };
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred while fetching sources';
            console.error('Error fetching sources:', err);
            sources.value = {
                brands: [],
                countries: [],
                subsegments: [],
                products: [],
                campaigntypes: [],
                languages: []
            };
        } finally {
            isLoading.value = false; // Annahme: Teil des generischen Loadings
        }
    }

    // *** NEUE ACTION: Einzelnen Mediaplan laden ***
    async function fetchMediaplan(id: string) {
        isLoading.value = true; // Nutze generisches isLoading
        error.value = null;     // Nutze generisches error
        selectedMediaplan.value = null; // Zurücksetzen

        // Validierung der ID (optional aber gut)
        if (!id) {
            error.value = "Mediaplan ID is missing.";
            isLoading.value = false;
            return;
        }

        try {
            const url = `/mediaplans/${id}`; // API Endpunkt gemäß Spec
            const response = await customFetch(url) as Mediaplan;
            selectedMediaplan.value = response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load mediaplan details';
            console.error(`Error fetching mediaplan ${id}:`, err);
            error.value = message;
            selectedMediaplan.value = null; // Sicherstellen, dass bei Fehler kein alter Plan angezeigt wird
        } finally {
            isLoading.value = false;
        }
    }


    function setFilter(key: keyof MediaplanFilter, value: any) {
        // Erstelle eine Kopie, um Reaktivitätsprobleme zu vermeiden
        const newFilters = {...filters.value, [key]: value};
        // Entferne leere Werte, um die Query sauber zu halten (optional)
        // if (value === '' || value === null || value === undefined) {
        //     delete newFilters[key];
        // }
        filters.value = newFilters;
        currentPage.value = 0; // Zurück zur ersten Seite bei Filteränderung
        fetchMediaplans();    // Daten neu laden
    }


    function clearFilters() {
        filters.value = { // Setze alle definierten Filter zurück
            search: '',
            status: '',
            brand_id: undefined,
            country: undefined,
            start_date_after: undefined,
            start_date_before: undefined,
            created_by_me: undefined,
            currently_running: undefined
        };
        currentPage.value = 0; // Zurück zur ersten Seite
        fetchMediaplans();    // Daten neu laden
    }

    function setSorting(field: string, order: 'asc' | 'desc') {
        sortBy.value = field;
        sortOrder.value = order;
        // Paginierung muss *nicht* zurückgesetzt werden bei Sortierung
        fetchMediaplans(); // Daten neu laden mit neuer Sortierung
    }

    function setPage(page: number) {
        // Stelle sicher, dass die Seite im gültigen Bereich liegt (optional)
        // if (page >= 0 && page < totalPages.value) {
        currentPage.value = page;
        fetchMediaplans(); // Daten für die neue Seite laden
        // }
    }

    // Initialize data (lädt Liste und Quellen)
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
        selectedMediaplan, // *** NEU: Exportiere den State ***

        // Getters
        hasFilters,

        // Actions
        fetchMediaplans,
        fetchSources,
        setFilter,
        clearFilters,
        setSorting,
        setPage,
        init,
        fetchMediaplan, // *** NEU: Exportiere die Action ***
    };
});