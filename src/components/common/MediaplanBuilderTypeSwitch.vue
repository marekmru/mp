<template>
    <v-select
        v-model="localBuilderType"
        :items="builderOptions"
        item-title="name"
        item-value="id"
        density="compact"
        hide-details
        variant="outlined"
        class="ml-2"
        style="max-width: 140px"
        @update:model-value="emit('update:builderType', $event)"
    />
</template>

<script setup>

import {ref, watch, defineEmits} from 'vue'

const emit = defineEmits(['update:builderType'])
const props = defineProps({
  builderType: {type: String, default: 'sea'}
})

const localBuilderType = ref(props.builderType)
watch(() => props.builderType, (val) => localBuilderType.value = val)

const builderOptions = [
  {id: 'sea', name: 'SEA'},
  {id: 'social', name: 'Social'},
  {id: 'display', name: 'Display'},
  {id: '2layer', name: '2-Layer'}
]
</script>