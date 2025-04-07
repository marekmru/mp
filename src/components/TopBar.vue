<template>
  <v-app-bar app color="white" class="px-5" fixed height="68" scroll-behavior="elevate" scroll-threshold="200" px-7>
    <v-menu>
      <template #activator="{ props }">
        <v-btn size="x-large" class="mr-2" icon="mdi-dots-grid" :="props"></v-btn>
      </template>
      <v-list class="pt-0 pb-0">
        <v-list-item color="primary" to="/">
          <template #prepend>
            <v-icon icon="mdi-view-dashboard" color="primary"></v-icon>
          </template>
          <v-list-item-title>Overview</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <router-link to="/">
      <v-row align="center" no-gutters>
        <h4 class="text-h5 mr-4">Mediaplan</h4>
        <img alt="BMW Logo" class="mr-3" src="/img/brands/BMW.svg" width="35" />
        <img alt="MINI Logo" class="mr-3" src="/img/brands/MINI.svg" width="76" />
        <img alt="MINI Logo" class="mr-3" src="/img/the-marcom-engine.png" width="240" />
      </v-row>
    </router-link>
    <v-spacer />
  </v-app-bar>
</template>

<script setup>
// No script setup needed
</script>

<style scoped>
h4 {
  text-decoration: none !important;
  color: rgba(0, 0, 0, 0.87);
}

.router-link-active,
a,
.router-link {
  text-decoration: none !important;

  &:visited {
    color: inherit;
  }
}
</style>