<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router'; // Router importieren für Links
import CountryFlag from '@/components/common/CountryFlag.vue'; // Pfad prüfen
import { getBrandLogo } from "@/helpers/brandUtils"; // Pfad prüfen
import type { Project } from '@/types/project'; // Pfad prüfen

// --- Props ---
interface Props {
  projects: Project[];
  totalProjects: number;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  mediaplanId: string; // *** Diese Prop ist entscheidend für den Link ***
}

const props = withDefaults(defineProps<Props>(), {
  projects: () => [],
  totalProjects: 0,
  isLoading: false,
  currentPage: 0,
  itemsPerPage: 10,
  mediaplanId: '' // Wichtig: Muss vom Parent (MediaplanDetail) übergeben werden!
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
  set: (value) => {}
});

const itemsPerPageModel = computed({
  get: () => props.itemsPerPage,
  set: (value) => {}
});

// --- Tabellen-Header ---
const headers = [
  { title: '', key: 'edit', sortable: false, width: '50px' },
  { title: 'Name', key: 'abbreviation', sortable: true, align: 'start' },
  { title: 'Country', key: 'descriptive_vars.country', sortable: true },
  { title: 'Duration', key: 'duration.formatted', sortable: false },
  { title: 'Detail', key: 'detail', sortable: true },
  { title: 'Campaign Type', key: 'default_vars.campaigntype', sortable: true },
  { title: 'Subsegment', key: 'default_vars.subsegment', sortable: true },
  { title: 'Locked', key: 'is_locked', sortable: true, align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '50px' }
];

// --- Methoden ---
const onOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }) => {
  emit('update:options', options);
};

const addProject = () => {
  emit('addProject');
};

const editProject = (project: Project) => {
  console.log('Edit project:', project._id);
  // Navigation zur Edit-Seite oder Dialog öffnen
  // router.push({ name: 'ProjectEdit', params: { mediaplanId: props.mediaplanId, projectId: project._id } });
};

</script>

<template>
  <div class="planning-view-container mt-4">
    <v-card class="projects-table elevation-0" variant="flat">
      <v-theme-provider theme="dark">
        <v-data-table-server
            v-model:items-per-page="itemsPerPageModel"
            v-model:page="pageModel"
            :headers="headers"
            :items="projects"
            :items-length="totalProjects"
            :loading="isLoading"
            item-value="_id"
            hover
            class="projects-data-table"
            @update:options="onOptionsUpdate"

        >
          <template v-slot:item.edit="{ item }">
            <v-btn icon density="comfortable" variant="text" color="grey" @click.stop="editProject(item)">
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Edit Project</v-tooltip>
            </v-btn>
          </template>

          <template v-slot:item.abbreviation="{ item }">
            <router-link
                :to="{ name: 'ProjectDetail', params: { mediaplanId: props.mediaplanId, projectId: item._id } }"
                class="project-link d-flex align-center"
                v-if="item.abbreviation && props.mediaplanId"
                @click.stop
            >
              <v-avatar size="32" class="mr-2 grey lighten-4"
                        :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
              <span>{{ item.abbreviation }}</span>
            </router-link>
            <div class="d-flex align-center" v-else-if="item.abbreviation">
              <v-avatar size="32" class="mr-2 grey lighten-4"
                        :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
              <span>{{ item.abbreviation }}</span>
              <v-tooltip activator="parent" location="top">Cannot link project (missing Mediaplan ID)</v-tooltip>
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
            <v-tooltip v-if="item.detail && item.detail.length > 30" activator="parent" location="top" max-width="300px">{{ item.detail }}</v-tooltip>
          </template>

          <template v-slot:item.default_vars.campaigntype="{ item }">
            {{ item.default_vars?.campaigntype || 'N/A' }}
          </template>

          <template v-slot:item.default_vars.subsegment="{ item }">
            {{ item.default_vars?.subsegment || 'N/A' }}
          </template>

          <template v-slot:item.is_locked="{ item }">
            <v-icon v-if="item.is_locked != null" :color="item.is_locked ? 'orange' : 'grey-lighten-1'">
              {{ item.is_locked ? 'mdi-lock' : 'mdi-lock-open-variant' }}
            </v-icon>
            <v-tooltip activator="parent" location="top">{{ item.is_locked ? 'Locked' : 'Unlocked' }}</v-tooltip>
          </template>

          <template v-slot:item.actions="{ item }">
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
          <template v-slot:no-data>
            <div class="text-center pa-4 text-disabled">
              <v-icon size="large" class="mb-2">mdi-database-off-outline</v-icon>
              <p>No projects found for this mediaplan.</p>
            </div>
          </template>

          <template v-slot:bottom>
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

<style scoped>
/* ... (Styles bleiben) ... */
.project-link {
  color: white; /* Oder eine andere passende Farbe im Dark Theme */
  text-decoration: none;
  font-weight: 500;
}
.project-link:hover {
  text-decoration: underline;
  color: #E0E0E0; /* Leichte Aufhellung beim Hover */
}
</style>