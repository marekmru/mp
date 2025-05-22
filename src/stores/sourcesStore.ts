import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import customFetch from '@/helpers/customFetch';
import type {Source, Brand} from '@/types/mediaplan';

export type GlossaryHandlerResponse = Record<string, Array<Record<string, any>>>;

export interface SourcesStateValues {
    [key: string]: Array<Source | Brand | Record<string, any>>;
}

export const useSourcesStore = defineStore('sources', () => {
    const sourcesData = ref<SourcesStateValues>({});
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const currentType = ref<string | null>(null);
    const currentLevel = ref<string | null>(null);

    const getSourceList = computed(() => {

        const tmp =  (dimensionKey: string): Array<Source | Brand | Record<string, any>> | undefined => {
            return sourcesData.value[dimensionKey];
        };
        return tmp
    });

    async function fetchSources(type: string, level: string): Promise<boolean> {
        if (!type || !level) {
            error.value = 'Type and level are required to fetch sources.';
            console.error(error.value);
            currentType.value = null;
            currentLevel.value = null;
            return false;
        }

        isLoading.value = true;
        error.value = null;
        try {
            const endpoint = `settings?type=${encodeURIComponent(type)}&level=${encodeURIComponent(level)}`;
            const response = await customFetch(endpoint) as GlossaryHandlerResponse;
            const data = response.data
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    sourcesData.value[key] = data[key];
                }
            }
            console.log(sourcesData.value)
            currentType.value = type;
            currentLevel.value = level;

            console.log(`Sources fetched and state updated for type: ${type}, level: ${level}`, sourcesData.value);
            return true;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `Failed to fetch sources for type '${type}' and level '${level}'`;
            error.value = errorMessage;
            console.error(`Error fetching sources (type: ${type}, level: ${level}):`, err);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        sourcesData,
        isLoading,
        error,
        currentType,
        currentLevel,
        getSourceList,
        fetchSources,
    };
});