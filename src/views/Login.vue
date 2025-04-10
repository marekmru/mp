<template>
  <v-container fluid style="max-width: 1600px" class="d-flex justify-center">
    <v-sheet class="pa-6" rounded elevation="4" max-width="480" width="100%" style="margin-top: 100px;">
      <v-form @submit.prevent="onSubmit" class="form-container">
        <h4 class="text-h4 font-weight-medium mb-3">
          Welcome to the BMW Group Mediaplan.
        </h4>
        <v-text-field
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="Name"
            variant="outlined"
            clearable
            class="mb-3"
        />

        <v-text-field
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="Password"
            type="password"
            variant="outlined"
            clearable
            class="mb-6"
        />

        <v-alert
            v-if="authStore.error"
            class="mb-4"
            type="error"
            variant="tonal"
            border="start"
            closable
            @close="authStore.error = null"
            icon="mdi-alert-circle-outline"
        >
          {{ authStore.error }}
        </v-alert>

        <v-row justify="end">
          <v-col cols="auto">
            <v-btn :disabled="authStore.isLoading" type="submit" color="primary">
              Login
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import {reactive} from 'vue'; // No need to import ref if not used independently
import {useAuthStore} from '../stores/auth';
import {useRouter} from 'vue-router';
import {useField, useForm} from 'vee-validate';
import {VAlert} from 'vuetify/components'; // Correct import for VAlert

const router = useRouter();
const authStore = useAuthStore();
const validationSchema = {
  name(value: string) { // Type annotation for value
    if (value?.length >= 2) {
      return true;
    }
    return 'Name needs to be at least 2 characters.';
  },
  password(value: string) { // Type annotation for value
    if (value?.length >= 6) {
      return true;
    }
    return 'Password needs to be at least 6 characters.';
  },
}


const {handleSubmit, handleReset} = useForm({ //Removed the Reset, not used
  validationSchema
});

const name = useField('name', validationSchema,
    {
      initialValue: 'onebuilderPlanner'
    }
);
const password = useField('password', validationSchema,
    {
      initialValue: 'OnebuilderPlanner1'
    });

const onSubmit = handleSubmit(async (values) => {
  // No need for local errorMessage, use authStore.error
  // No need for local form.pending, use authStore.isLoading

  try {
    await authStore.login(values.name, values.password);
    // Redirect *after* successful login (handled in the store)
    if (authStore.isAuthenticated) {
      router.push('/');
    }

  } catch (error: any) {
    //  Error handling is now done in the store, so we don't need this here.
    //  The store will set authStore.error appropriately.
    console.error("Login Error in Component:", error); // Good for debugging
  }
  // No finally block needed, authStore.isLoading is handled in the store.
});
</script>

<style scoped>
.form-container {
  max-width: 430px;
  margin: 0 auto;
}
</style>