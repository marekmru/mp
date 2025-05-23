<template>
  <v-card flat class="mt-4 lineitem-table-card">
    <v-data-table-server
        v-model="selectedItems"
        :headers="lineitemHeaders"
        :items="items"
        :items-length="totalItems"
        :loading="isLoading"
        :search="search"
        :page="currentPageInternal"
        :items-per-page="itemsPerPageInternal"
        :sort-by="sortBy"
        class="elevation-0 lineitem-data-table"
        item-value="_id"
        show-select
        select-strategy="page"
        @update:options="handleOptionsUpdate"
        @update:model-value="updateSelection"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
      </template>

      <template v-slot:item.created_at="{ value }">
        {{ formatDate(value) }}
      </template>
      <template v-slot:item.updated_at="{ value }">
        {{ formatDate(value) }}
      </template>

      <template v-slot:item.lineitemname="{ item }">
        <v-tooltip location="top" :text="item.lineitemname">
          <template v-slot:activator="{ props }">
                <span v-bind="props" class="d-inline-block text-truncate" style="max-width: 250px;">
                    {{ item.lineitemname }}
                </span>
          </template>
        </v-tooltip>
      </template>

      <template v-slot:no-data>
        <div class="text-center pa-4 text-disabled">
          <v-icon size="x-large" class="mb-2">mdi-database-off-outline</v-icon>
          <p v-if="search">No line items found matching your search "{{ search }}".</p>
          <p v-else>No line items found for this campaign.</p>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn icon density="compact" size="small" variant="text" @click.stop="() => console.log('Edit Lineitem:', item._id)" class="mr-2">
          <v-icon>mdi-pencil-outline</v-icon>
          <v-tooltip activator="parent" location="top">Edit Project</v-tooltip>
        </v-btn>
        <v-menu>
          <template v-slot:activator="{ props: menuProps }">
            <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
          </template>
          <v-list density="compact">
            <v-list-item  @click.stop="() => console.log('Edit Lineitem:', item._id)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop="() => console.log('Delete Lineitemjk:', item._id)" class="text-error">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue';
import type { VDataTableServer } from 'vuetify/components/VDataTable';
import { formatDate } from '@/helpers/dateUtils';
import type { Lineitem } from '@/types/lineitem';
import {lineitemHeaders} from "@/constants/lineitem.ts"; // Pfad anpassen

type ReadonlyHeaders = VDataTableServer['$props']['headers'];

const props = defineProps({
  items: {
    type: Array as PropType<Lineitem[]>,
    required: true,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  totalItems: {
    type: Number,
    required: true
  },
  currentPage: { // 0-basiert vom Store
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  sortByServer: {
    type: Array as PropType<{ key: string; order: 'asc' | 'desc' }[]>,
    default: () => []
  },
  search: { // Suchbegriff von außen
    type: String,
    default: ''
  },
  // V-model für ausgewählte Elemente
  modelValue: {
    type: Array as PropType<string[]>, // Array von IDs (_id)
    default: () => []
  }
});

const emit = defineEmits(['update:options', 'update:modelValue', 'add-item', 'edit-item', 'delete-item']);

// Lokaler State für Tabelle
const currentPageInternal = ref(props.currentPage + 1); // Tabelle ist 1-basiert
const itemsPerPageInternal = ref(props.itemsPerPage);
const sortBy = ref(props.sortByServer);

// Lokaler State für v-model der Tabelle
const selectedItems = ref<string[]>(props.modelValue);

// Handler für Optionen (Paginierung, Sortierung)
const handleOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy: { key: string; order: 'asc' | 'desc' }[] }) => {
  currentPageInternal.value = options.page;
  itemsPerPageInternal.value = options.itemsPerPage;
  sortBy.value = options.sortBy;

  emit('update:options', {
    page: options.page - 1, // An Parent 0-basiert
    itemsPerPage: options.itemsPerPage,
    sortBy: options.sortBy
  });
};

// Handler für Selektionsänderung
const updateSelection = (newSelection: string[]) => {
  selectedItems.value = newSelection;
  emit('update:modelValue', newSelection); // Parent informieren
}

// Watchers zur Synchronisierung mit Parent Props
watch(() => props.currentPage, (newVal) => {
  currentPageInternal.value = newVal + 1;
});
watch(() => props.itemsPerPage, (newVal) => {
  itemsPerPageInternal.value = newVal;
});
watch(() => props.sortByServer, (newVal) => {
  sortBy.value = newVal;
}, { deep: true });
watch(() => props.modelValue, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(selectedItems.value)) {
    selectedItems.value = newVal;
  }
}, { deep: true });

</script>

<style scoped>

</style>