<template>
  <v-container fluid class="fill-height pa-0">
    <v-row align="center" justify="center" class="fill-height ma-0">
      <v-col cols="12" md="7" lg="8" class="d-none d-md-flex bg-img fill-height pa-0">
      </v-col>

      <v-col cols="12" md="5" lg="4" class="d-flex align-center justify-center pa-6 fill-height">
        <v-sheet class="pa-sm-10 pa-6" rounded elevation="4" max-width="480" width="100%">
          <div class="text-center mb-6">
            <img src="/img/the-marcom-engine.png" alt="The Marcom Engine" width="280"/>
            <h4 class="text-h5 font-weight-medium mt-6">
              BMW Group Mediaplan
            </h4>
          </div>

          <v-form ref="loginFormRef" @submit.prevent="onSubmit">
            <v-alert
                v-if="authStore.error"
                class="mb-4"
                type="error"
                variant="tonal"
                border="start"
                closable
                @click:close="clearAuthError"
                icon="mdi-alert-circle-outline"
                density="compact"
            >
              {{ authStore.error }}
            </v-alert>

            <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                variant="outlined"
                prepend-inner-icon="mdi-account-outline"
                class="mb-4"
                density="comfortable"
                autofocus
                required
            />

            <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                class="mb-6"
                density="comfortable"
                required
            />

            <v-btn
                :loading="authStore.isLoading"
                :disabled="authStore.isLoading"
                type="submit"
                color="primary"
                block
                size="large"
            >
              Login
            </v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useAuthStore} from '@/stores/auth';
import {useRouter} from 'vue-router';
import type {VForm} from 'vuetify/components';

const router = useRouter();
const authStore = useAuthStore();
const loginFormRef = ref<InstanceType<typeof VForm> | null>(null);

const username = ref('admin');
const password = ref('hans');

const usernameRules = [
  (value: string) => !!value || 'Username is required.',
  (value: string) => (value && value.length >= 2) || 'Username needs to be at least 2 characters.',
  (value: string) => (value && value.length <= 100) || 'Username must be less than 100 characters.',
];

const passwordRules = [
  (value: string) => !!value || 'Password is required.',
  (value: string) => (value && value.length >= 3) || 'Password must be at least 3 characters.',
];

const clearAuthError = () => {
  authStore.error = null;
};

const onSubmit = async () => {
  if (authStore.isLoading) return;

  const {valid} = await loginFormRef.value?.validate() || {valid: false};

  if (valid) {
    await authStore.login(username.value, password.value);
    if (authStore.isAuthenticated) {
      router.push('/');
    }
  }
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});

</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.bg-img {
  background-image: url('/img/login-bg.jpg');
  background-position: center center;
  background-size: cover;
  background-color: #e0e0e0;
}
</style>