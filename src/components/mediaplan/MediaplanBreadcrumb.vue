// src/components/mediaplan/MediaplanBreadcrumb.vue (Angepasst)

<script setup lang="ts">
import {computed} from 'vue';
import {useRouter} from 'vue-router';
import type {Mediaplan} from '@/types/mediaplan'; // Pfad prüfen
import type {Project} from '@/types/project';
import {getBrandLogo} from "@/helpers/brandUtils.ts";   // Pfad prüfen
const router = useRouter();

// --- Props ---
// Akzeptiert jetzt optional ein ganzes Project-Objekt
interface Props {
  mediaplan?: Mediaplan | null;
  project?: Project | null;     // NEU: Akzeptiert Project-Objekt statt nur Name
  campaignName?: string;        // Bleibt vorerst als String
}

// Define events
const emit = defineEmits(['back']);

// Props mit Defaults
const props = withDefaults(defineProps<Props>(), {
  mediaplan: null,
  project: null,
  campaignName: '',
});

// --- Computed Properties für die Anzeige ---
const breadcrumbItems = computed(() => {
  const items = [];
  // Immer Home/Übersicht als Basis? Oder dynamisch? Hier als Beispiel statisch.
  items.push({title: 'Mediaplans', to: '/', disabled: !props.mediaplan});

  if (props.mediaplan) {
    items.push({
      title: props.mediaplan.name || 'Mediaplan',
      // Link nur aktiv, wenn wir tiefer sind (also wenn ein Projekt übergeben wurde)
      to: props.project ? {name: 'MediaplanDetail', params: {id: props.mediaplan._id}} : undefined,
      disabled: !props.project
    });

    if (props.project) {
      items.push({
        title: props.project.abbreviation || props.project.descriptive_vars?.projectname || 'Project',
        // Link nur aktiv, wenn wir tiefer sind (also wenn campaignName übergeben wurde)
        to: props.campaignName ? {
          name: 'ProjectDetail',
          params: {mediaplanId: props.mediaplan._id, projectId: props.project._id}
        } : undefined,
        disabled: !props.campaignName
      });

      if (props.campaignName) {
        items.push({
          title: props.campaignName,
          // Kein Link für das letzte Element
          disabled: true
        });
      }
    }
  }
  return items;
});


// --- Methods ---
const handleBack = () => {
  emit('back'); // Event auslösen
  // Gehe zur Mediaplan-Übersicht (oder eine Ebene höher, falls möglich/gewünscht)
  router.push({name: 'Overview'}); // Gehe zur allgemeinen Übersicht
};

</script>

<template>
  <div class="d-flex align-center">
    <v-btn
        icon
        variant="text"
        size="small"
        class="mr-1"
        @click="handleBack"
        aria-label="Go back to overview"
    >
      <v-icon> mdi-arrow-u-left-top
      </v-icon>
      <v-tooltip activator="parent" location="bottom">Back to Overview</v-tooltip>
    </v-btn>

    <div class="breadcrumb-content d-flex align-center flex-wrap">
      <div class="brand-logo mr-2 flex-shrink-0" v-if="mediaplan?.brand">
        <v-img
            :src="getBrandLogo(mediaplan.brand)"
            :alt="mediaplan.brand.name || ''"
            width="50"
            height="25"
            contain
        ></v-img>
      </div>

      <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
        <template v-slot:title="{ item }">
              <span :class="{ 'text-disabled': item.disabled }">
                  {{ item.title }}
              </span>
        </template>
      </v-breadcrumbs>

    </div>
  </div>
</template>

<style scoped>
.breadcrumb-content {
  min-height: 40px; /* Höhe beibehalten */
  overflow: hidden; /* Verhindert Umbruchprobleme bei sehr langen Namen */
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Optional: Stelle sicher, dass Breadcrumbs nicht zu viel Platz einnehmen */
.v-breadcrumbs {
  flex-grow: 1;
  /* white-space: nowrap; */ /* Verhindert Umbruch, ggf. mit text-overflow */
}

.v-breadcrumbs :deep(.v-breadcrumbs-item) {
  font-size: 0.9rem; /* Etwas kleinere Schrift */
}

.text-disabled {
  color: #757575 !important; /* Vuetify Standard für disabled */
}
</style>