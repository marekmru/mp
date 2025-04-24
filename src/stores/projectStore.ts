// src/stores/projectStore.ts
import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import customFetch from '@/helpers/customFetch';
import type {
    Project,
    ProjectCreate,
    ProjectCountry,
    ProjectLanguage,
    ProjectCampaignType,
    ProjectPhase,
    ProjectGoal,
    ProjectBuilder,
    ProjectListResponse
} from '@/types/project';

export const useProjectStore = defineStore('project', () => {
    // State
    const projects = ref<Project[]>([]);
    const selectedProject = ref<Project | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Options for project form
    const countries = ref<ProjectCountry[]>([]);
    const languages = ref<ProjectLanguage[]>([]);
    const campaignTypes = ref<ProjectCampaignType[]>([]);
    const phases = ref<ProjectPhase[]>([]);
    const goals = ref<ProjectGoal[]>([]);
    const builders = ref<ProjectBuilder[]>([]);

    // Pagination state
    const totalItems = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const perPage = ref(10);

    // Getters
    const getProjectById = computed(() => {
        return (id: string) => projects.value.find(project => project._id === id) || null;
    });

    // Actions
    async function fetchProjects(mediaplanId: string) {
        isLoading.value = true;
        error.value = null;

        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            queryParams.append('page', currentPage.value.toString());
            queryParams.append('per_page', perPage.value.toString());

            const url = `/mediaplans/${mediaplanId}/projects?${queryParams.toString()}`;
            const response = await customFetch(url) as ProjectListResponse;

            projects.value = response.items;
            totalItems.value = response.total_items;
            totalPages.value = response.total_pages;
            currentPage.value = response.current_page;

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred while fetching projects';
            console.error('Error fetching projects:', err);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchProject(mediaplanId: string, projectId: string) {
        isLoading.value = true;
        error.value = null;

        try {
            const url = `/mediaplans/${mediaplanId}/projects/${projectId}`;
            const response = await customFetch(url) as Project;
            selectedProject.value = response;
            return response;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred while fetching project';
            console.error('Error fetching project:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function createProject(projectData: ProjectCreate) {
        isLoading.value = true;
        error.value = null;

        try {
            const url = `/mediaplans/${projectData.mediaplanId}/projects`;

            // For our implementation, we need to adjust the data structure to match the API expectations
            const payload = {
                abbreviation: projectData.name,
                default_vars: {
                    targeturls: null,
                    subsegment: projectData.phase,
                    campaigntype: projectData.campaignType,
                    language: projectData.language,
                    campaigndetail: null,
                    adtype: "Banner",
                    dimension: "300x250"
                },
                descriptive_vars: {
                    brand: "BMW", // This would typically be dynamic
                    country: projectData.country.code,
                    bmwponumber: "PO12345", // This would be dynamic based on the selected PO
                    adobecampaignname: projectData.name,
                    subsegment: projectData.phase,
                    campaigntype: projectData.campaignType,
                    projectname: projectData.name,
                    year: new Date().getFullYear()
                },
                is_locked: false,
                labels: [],
                lock_state: 0,
                owner: "user123", // Would be the current user
                message: "OK",
                version: "v1"
            };

            // For demo purposes, log the payload
            console.log('Creating project with data:', payload);

            // In a real implementation, we would send the API request
            /*
            const response = await customFetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });

            return response._id;
            */

            // For demo, simulate successful creation
            await new Promise(resolve => setTimeout(resolve, 500));

            // Return a mock project ID
            return `project-${Date.now()}`;

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred while creating project';
            console.error('Error creating project:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchProjectOptions() {
        isLoading.value = true;
        error.value = null;

        try {
            // In a real application, we would fetch these from the API
            // For this demo, we're using mock data

            // Mock countries
            countries.value = [
                {code: 'AT', name: 'Austria'},
                {code: 'DE', name: 'Germany'},
                {code: 'PL', name: 'Poland'},
                {code: 'US', name: 'United States'}
            ];

            // Mock languages
            languages.value = [
                {code: 'DEU', name: 'German'},
                {code: 'ENG', name: 'English'},
                {code: 'POL', name: 'Polish'}
            ];

            // Mock campaign types
            campaignTypes.value = [
                {id: 'always-on', name: 'Always On'},
                {id: 'awareness', name: 'Awareness'},
                {id: 'consideration', name: 'Consideration'}
            ];

            // Mock phases
            phases.value = [
                {id: 'sea', name: 'SEA'},
                {id: 'planning', name: 'Planning'},
                {id: 'execution', name: 'Execution'}
            ];

            // Mock goals
            goals.value = [
                {id: 'consideration', name: 'Consideration'},
                {id: 'configurator', name: 'Configurator'},
                {id: 'conversion', name: 'Conversion'}
            ];

            // Mock builders
            builders.value = [
                {id: 'sea', name: 'SEA'},
                {id: 'social', name: 'Social'},
                {id: 'display-2layer', name: 'Display 2Layer'}
            ];

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred while fetching project options';
            console.error('Error fetching project options:', err);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        // State
        projects,
        selectedProject,
        isLoading,
        error,
        countries,
        languages,
        campaignTypes,
        phases,
        goals,
        builders,
        totalItems,
        totalPages,
        currentPage,
        perPage,

        // Getters
        getProjectById,

        // Actions
        fetchProjects,
        fetchProject,
        createProject,
        fetchProjectOptions
    };
});
