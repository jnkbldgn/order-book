<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings/index';

const settingsStore = useSettingsStore();

onServerPrefetch(() => {
  settingsStore.fetchPairs();
});
</script>
