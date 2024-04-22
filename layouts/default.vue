<template>
  <v-app
    :full-height="false"
    class="h-screen overflow-hidden"
  >
    <c-header>
      {{ currentPair.value }}
    </c-header>
    <v-main class="h-100">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings';
import { storeToRefs } from 'pinia';

const settingsStore = useSettingsStore();

const { currentPair } = storeToRefs(settingsStore);
</script>
