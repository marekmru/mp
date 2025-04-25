<!-- src/components/common/form/CountryLanguageSelector.vue -->
<template>
  <v-row>
    <v-col>

      <FormElementVrowVcol label="Country" required>
        <v-select
            v-model="selectedCountry"
            :items="countries"
            item-title="name"
            item-value="code"
            placeholder="Select Country"
            return-object
            :rules="[required]"
            :loading="loading"
        >
          <template v-slot:selection="{ item }">
            <div class="d-flex align-center">
              <country-flag :country="item.raw.code" class="mr-2" size="1rem"/>
              {{ item.raw.code }} - {{ item.raw.name }}
            </div>
          </template>
          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" :title="`${item.raw.code} - ${item.raw.name}`">
              <template v-slot:prepend>
                <country-flag :country="item.raw.code" class="mr-2" size="1rem"/>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </FormElementVrowVcol>
    </v-col>
    <v-col>
      <FormElementVrowVcol label="Language" required>
        <v-select
            v-model="selectedLanguage"
            :items="filteredLanguages"
            item-title="name"
            item-value="code"
            placeholder="Select Language"
            persistent-hint
            hint="*Depends on Country"
            :rules="[required]"
            :disabled="!selectedCountry"
            :loading="loading"
        />
      </FormElementVrowVcol>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted} from 'vue';
import {useProjectStore} from '@/stores/projectStore';
import FormElementVrowVcol from "@/components/common/dialog/FormElementVrowVcol.vue";
import CountryFlag from "@/components/common/CountryFlag.vue";

const emit = defineEmits<{
  (e: 'update:modelValue', val: { country: any; language: string | null }): void;
}>();

const props = defineProps<{
  modelValue?: {
    country: any;
    language: string | null;
  };
}>();

const projectStore = useProjectStore();
const loading = ref(false);

const selectedCountry = ref(props.modelValue?.country || null);
const selectedLanguage = ref(props.modelValue?.language || null);

const required = (v: any) => !!v || 'Required';

const countries = computed(() => projectStore.countries);
const allLanguages = computed(() => projectStore.languages);

const filteredLanguages = computed(() => {
  if (!selectedCountry.value) return [];
  return allLanguages.value.filter(lang => lang.country_codes?.includes(selectedCountry.value.code));
});

watch([selectedCountry, selectedLanguage], () => {
  emit('update:modelValue', {
    country: selectedCountry.value,
    language: selectedLanguage.value,
  });
});

watch(selectedCountry, (newVal, oldVal) => {
  if (newVal?.code !== oldVal?.code) {
    selectedLanguage.value = null;
  }
});

onMounted(async () => {
  if (!projectStore.countries.length || !projectStore.languages.length) {
    loading.value = true;
    await projectStore.fetchProjectOptions();
    loading.value = false;
  }
});
</script>