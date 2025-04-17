<template>
  <v-row class="mb-0">
    <v-col cols="12" md="5" class="d-flex align-center pt-0 pb-0">
      <MediaplanBreadcrumb :mediaplan="mediaplan" :project="project" />
    </v-col>
    <v-col cols="12" md="7">
      <MediaplanHeader
          :plan-budget="mediaplan?.budget?.total || 0"
          :used-percentage="calculatePercentage(mediaplan?.budget?.used, mediaplan?.budget?.total)"
          :search="search"
          @update:search="$emit('update:search', $event)"
          :is-loading="isLoading" />
    </v-col>
  </v-row>

  <v-row class="mb-4">
    <v-col cols="12" sm="auto">
      <MediaplanViewToggle v-model="currentView" />
    </v-col>
    <v-col>
      <!-- You can optionally add the campaign type select as a slot or prop -->
      <slot name="campaign-type-select" />
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  mediaplan: Object,
  project: Object,
  search: String,
  isLoading: Boolean,
  currentView: {
    type: String,
    required: true
  }
})

defineEmits(['update:search', 'update:currentView'])

function calculatePercentage(used, total) {
  if (!used || !total) return 0
  return (used / total) * 100
}
</script><template>
  <v-row class="mb-0">
    <v-col cols="12" md="5" class="d-flex align-center pt-0 pb-0">
      <MediaplanBreadcrumb :mediaplan="mediaplan" :project="project" />
    </v-col>
    <v-col cols="12" md="7">
      <MediaplanHeader
          :plan-budget="mediaplan?.budget?.total || 0"
          :used-percentage="calculatePercentage(mediaplan?.budget?.used, mediaplan?.budget?.total)"
          :search="search"
          @update:search="$emit('update:search', $event)"
          :is-loading="isLoading" />
    </v-col>
  </v-row>

  <v-row class="mb-4">
    <v-col cols="12" sm="auto">
      <MediaplanViewToggle v-model="currentView" />
    </v-col>
    <v-col>
      <!-- You can optionally add the campaign type select as a slot or prop -->
      <slot name="campaign-type-select" />
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  mediaplan: Object,
  project: Object,
  search: String,
  isLoading: Boolean,
  currentView: {
    type: String,
    required: true
  }
})

defineEmits(['update:search', 'update:currentView'])

function calculatePercentage(used, total) {
  if (!used || !total) return 0
  return (used / total) * 100
}
</script>