<template>
  <v-menu v-model="isOpen" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
    </template>

    <v-card min-width="280">
      <v-toolbar density="compact" color="white">
        <v-toolbar-title class="text-body-1 font-weight-medium">Options</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" color="primary" size="small" @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list class="menu-list">
        <v-list-item @click="handleAction('view')" class="menu-item">
          <template v-slot:prepend>
            <v-icon icon="mdi-eye" size="small"></v-icon>
          </template>
          <v-list-item-title>View Mediaplan</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAction('edit')" class="menu-item">
          <template v-slot:prepend>
            <v-icon icon="mdi-pencil-outline" size="small"></v-icon>
          </template>
          <v-list-item-title>Edit base data</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAction('addPo')" class="menu-item">
          <template v-slot:prepend>
            <v-icon icon="mdi-plus" size="small"></v-icon>
          </template>
          <v-list-item-title>Add PO Number</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAction('export')" class="menu-item">
          <template v-slot:prepend>
            <v-icon icon="mdi-download" size="small"></v-icon>
          </template>
          <v-list-item-title>Export Media Plan</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAction('duplicate')" class="menu-item">
          <template v-slot:prepend>
            <v-icon icon="mdi-content-copy" size="small"></v-icon>
          </template>
          <v-list-item-title>Duplicate MediaPlan</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAction('archive')" class="menu-item">
          <template v-slot:prepend>
            <v-icon icon="mdi-archive-outline" size="small"></v-icon>
          </template>
          <v-list-item-title>Archive Media Plan</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleAction('delete')" class="menu-item">
          <template v-slot:prepend>
            <v-icon icon="mdi-delete-outline" size="small"></v-icon>
          </template>
          <v-list-item-title>Delete MediaPlan</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import {ref} from 'vue';

// Props
const props = defineProps<{
  mediaplanId: string;
}>();

// Emit events
const emit = defineEmits<{
  (e: 'action', action: string, mediaplanId: string): void;
}>();

// State
const isOpen = ref(false);

// Methods
const handleAction = (action: string) => {
  emit('action', action, props.mediaplanId);
  isOpen.value = false;
};
</script>

<style scoped>
.menu-list .v-list-item {
  border-top: 1px solid #e0e0e0;
}

</style>