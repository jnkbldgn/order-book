<template>
  <v-container
    tag="section"
    class="h-100 d-flex flex-column"
  >
    <h1 class="text-h5 text-uppercase">
      Settings
    </h1>

    <c-select
      class="mt-4 flex-0-0"
      :value="currentPair.value"
      :items="pairs"
      hint="You can change current pair"
      @change="(item) => changeCurrentPair(item as IPair)"
    />

    <v-data-table-virtual
      class="mt-4 flex-1-0"
      height="100"
      fixed-header
      :items="logs"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings/index';
import type { IPair } from '~/stores/settings/types';

const settingsStore = useSettingsStore();

const { changeCurrentPair } = settingsStore;
const { pairs, currentPair, logs } = storeToRefs(settingsStore);
</script>
