<template>
  <div class="d-flex align-center">
    <v-btn
        icon
        variant="text"
        class="mr-0"
        @click="handleBack"
    >
      <v-icon>mdi-arrow-u-left-top</v-icon>
    </v-btn>
    <div class="breadcrumb-content d-flex align-center">
      <!-- Brand Logo - Direct from mediaplan -->
      <div class="brand-logo mr-2" v-if="mediaplan?.brand?.logo">
        <v-img
            :src="mediaplan.brand.logo"
            :alt="mediaplan?.brand?.name || ''"
            width="60"
            contain
        ></v-img>
      </div>

      <!-- Mediaplan Name and Navigation -->
      <div class="breadcrumb-text">
        <span class="text-body-1 font-weight-medium text-grey-darken-3">{{ mediaplan?.name }}</span>
        <template v-if="projectName">
          <v-icon class="mx-1 text-grey" size="small">mdi-chevron-right</v-icon>
          <span class="text-body-2 text-grey-darken-1">{{ projectName }}</span>
        </template>
        <template v-if="campaignName">
          <v-icon class="mx-1 text-grey" size="small">mdi-chevron-right</v-icon>
          <span class="text-body-2 text-grey-darken-1">{{ campaignName }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import type {Mediaplan} from '@/types/mediaplan';

const router = useRouter();

// Define props
interface Props {
  projectName?: string;
  campaignName?: string;
  mediaplan?: Mediaplan;
}

// Define events
const emit = defineEmits(['back']);

// Receive props with defaults
const props = withDefaults(defineProps<Props>(), {
  projectName: '',
  campaignName: '',
  mediaplan: undefined
});

// Handle back button click - navigate to root path
const handleBack = () => {
  emit('back'); // Emit back event
  router.push('/'); // Navigate to root path
};

</script>

<style scoped>
.breadcrumb-content {
  min-height: 40px;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ensure the text is properly aligned vertically */
.breadcrumb-text {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
</style>