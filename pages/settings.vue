<template>
  <v-container
    tag="section"
    class="h-100 d-flex flex-column"
  >
    <h1 class="text-h5 text-uppercase">
      Settings
    </h1>

    <v-select
      id="current-pair"
      class="mt-4 flex-0-0"
      :value="currentPair.value"
      hint="You can change current pair"
      persistent-hint
      variant="outlined"
      density="compact"
      :items="pairs"
      item-title="value"
      :disabled="pairs.length === 0"
    >
      <template #item="{ props, item }">
        <v-list-item
          v-bind="props"
          :active="item.raw.value === currentPair.value"
          @click="() => changeCurrentPair(item.raw)"
        />
      </template>
    </v-select>

    <v-data-table-virtual
      class="mt-4 flex-1-0"
      height="100"
      fixed-header
      :items="logs"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings';

const settingsStore = useSettingsStore();

const { changeCurrentPair } = settingsStore;
const { pairs, currentPair, logs } = storeToRefs(settingsStore);
</script>
