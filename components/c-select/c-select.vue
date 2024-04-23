<template>
  <v-select
    :value="props.value"
    :hint="props.hint"
    persistent-hint
    variant="outlined"
    density="compact"
    :items="props.items"
    item-title="value"
    :disabled="props.items.length === 0"
  >
    <template #item="{ props: itemProps, item }">
      <v-list-item
        v-bind="itemProps"
        :active="item.raw.value === value"
        @click="() => emit('change', item.raw)"
      />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import type { ICSelectEmits, ICSelectProps } from './types';

const props = defineProps<ICSelectProps>();
const emit = defineEmits<ICSelectEmits>();
</script>
