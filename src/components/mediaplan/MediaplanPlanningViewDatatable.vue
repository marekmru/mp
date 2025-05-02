<template>
  <div class="planning-view-container mt-4">
    <EditOrCreateProjectDialog
        v-model="isProjectDialogOpen"
        :is-edit="!!selectedProject"
        :initial-data="selectedProject || undefined"
        @saved="onProjectSaved"
    />
    <v-card class="projects-table elevation-0" variant="flat">
      <v-theme-provider theme="dark">
        <v-data-table-server
            v-model:items-per-page="itemsPerPageModel"
            v-model:page="pageModel"
            :headers="projectHeaders"
            :hide-default-header="type === 'single'"
            :hide-default-footer="type==='single'"
            :items="projects"
            :items-length="totalProjects"
            :loading="isLoading"
            item-value="_id"
            hover
            class="projects-data-table"
            @update:options="onOptionsUpdate"

        >
<!--          <template v-slot:item.edit="{ item }">

          </template>-->

          <template v-slot:item.abbreviation="{ item }">
            <router-link
                :to="{ name: 'ProjectDetail', params: { mediaplanId: props.mediaplanId, projectId: item._id } }"
                class="name-link d-flex align-center"
                v-if="item.abbreviation && props.mediaplanId && type==='multi'"
                @click.stop
            >
              <v-avatar size="32" class="mr-2 grey lighten-4"
                        :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
              <span>{{ item.abbreviation }}</span>
              <v-tooltip activator="parent" location="top">Open project</v-tooltip>
            </router-link>
            <div class="d-flex align-center" v-else-if="item.abbreviation">
              <v-avatar size="32" class="mr-2 grey lighten-4"
                        :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
              <span>{{ item.abbreviation }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <template v-slot:item.descriptive_vars.country="{ item }">
            <div class="d-flex align-center" v-if="item.descriptive_vars?.country">
              <CountryFlag size="1rem" :country="item.descriptive_vars.country" class="mr-2"/>
              <span>{{ item.descriptive_vars.country }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <template v-slot:item.duration.formatted="{ item }">
            <div class="d-flex align-center" v-if="item.duration?.formatted">
              <v-icon size="small" class="mr-2">mdi-calendar-range</v-icon>
              <span>{{ item.duration.formatted }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <template v-slot:item.detail="{ item }">
            <span class="d-inline-block text-truncate" style="max-width: 150px;">{{ item.detail || 'N/A' }}</span>
            <v-tooltip v-if="item.detail && item.detail.length > 30" activator="parent" location="top"
                       max-width="300px">{{ item.detail }}
            </v-tooltip>
          </template>

          <template v-slot:item.default_vars.campaigntype="{ item }">
            {{ item.default_vars?.campaigntype || 'N/A' }}
          </template>

          <template v-slot:item.default_vars.subsegment="{ item }">
            {{ item.default_vars?.subsegment || 'N/A' }}
          </template>
          <template v-slot:item.budget="{ item }">
            <BudgetProgress
                :used-budget="item?.budget?.used"
                :total-budget="item?.budget?.total"
                color="success"
                bg-color="#ffffff"
            />
          </template>

          <template v-slot:item.is_locked="{ item }">
            <v-icon v-if="item.is_locked != null" :color="item.is_locked ? 'warning' : 'white'">
              {{ item.is_locked ? 'mdi-lock' : 'mdi-lock-open-variant' }}
            </v-icon>
            <v-tooltip activator="parent" location="top">{{ item.is_locked ? 'Locked' : 'Unlocked' }}</v-tooltip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn icon density="compact" size="small" variant="text" @click.stop="openEditProject(item)" class="mr-2">
              <v-icon>mdi-pencil-outline</v-icon>
              <v-tooltip activator="parent" location="top">Edit Project</v-tooltip>
            </v-btn>
            <v-menu>
              <template v-slot:activator="{ props: menuProps }">
                <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click.stop="editProject(item)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click.stop="() => console.log('Delete Project:', item._id)" class="text-error">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template v-slot:loading>
            <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
          </template>
          <template v-slot:no-data v-if="type === 'multi'">

            <div class="text-center pa-4 text-disabled">
              <v-icon size="large" class="mb-2">mdi-database-off-outline</v-icon>
              <p>No projects found for this mediaplan.</p>
            </div>
          </template>

          <template v-slot:bottom v-if="type === 'multi'">
            <div class="d-flex align-center pa-4 bg-grey-lighten-2">
              <v-btn
                  prepend-icon="mdi-plus"
                  class="black-text-button"
                  variant="text"
                  color="black"
                  @click="addProject"
                  :disabled="isLoading"
              >
                Add Project
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-theme-provider>
    </v-card>
  </div>

</template>

<script setup lang="ts">
import {ref, watch, computed} from 'vue';
import {useRouter} from 'vue-router';
import CountryFlag from '@/components/common/CountryFlag.vue';
import {getBrandLogo} from "@/helpers/brandUtils";
import type {Project} from '@/types/project';
import {projectHeaders} from "@/constants/project.ts";
import EditOrCreateProjectDialog from "@/components/project/EditOrCreateProjectDialog.vue";
import BudgetProgress from "@/components/common/dialog/BudgetProgress.vue";

/* Single for Display on Overviewpage, multi for complete datatable*/
type ComponentType = 'single' | 'multi';

// --- Props ---
interface Props {
  type: ComponentType | null | undefined;
  projects: Project[];
  totalProjects: number;
  isLoading: boolean;
  currentPage: number | null;
  itemsPerPage: number;
  mediaplanId: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'multi',
  projects: () => [],
  totalProjects: 0,
  isLoading: false,
  currentPage: 0,
  itemsPerPage: 10,
  mediaplanId: null // Wichtig: Muss vom Parent (MediaplanDetail) übergeben werden!

});

// --- Emits ---
const emit = defineEmits<{
  (e: 'addProject'): void;
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }): void;
}>();

// Router Instanz
const router = useRouter();

// --- Computed Properties für Tabelle ---
const pageModel = computed({
  get: () => props.currentPage + 1,
  set: (value) => {
  }
});

const itemsPerPageModel = computed({
  get: () => props.itemsPerPage,
  set: (value) => {
  }
});


// --- Methoden ---
const onOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }) => {
  emit('update:options', options);
};

const addProject = () => {
  emit('addProject');
};

const isProjectDialogOpen = ref(false);
const selectedProject = ref<Project | null>(null);

const openCreateProject = () => {
  selectedProject.value = null;
  isProjectDialogOpen.value = true;
};

const openEditProject = (project: Project) => {
  selectedProject.value = project;
  isProjectDialogOpen.value = true;
};

const onProjectSaved = (project: Project) => {
  isProjectDialogOpen.value = false;
  console.log(project)
  // Example: refetch list here if needed
  // await fetchProjects()
};
</script>


<style scoped>
/* ... (Styles bleiben) ... */

</style>