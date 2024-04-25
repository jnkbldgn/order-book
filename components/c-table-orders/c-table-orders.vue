<template>
  <v-data-table-virtual
    height="100%"
    density="compact"
    fixed-header
    :items="props.items"
    :headers="headers"
  >
    <template #top>
      <v-toolbar
        density="compact"
      >
        <v-toolbar-title>{{ props.header }}</v-toolbar-title>
      </v-toolbar>
    </template>

    <template #item="{item}">
      <tr
        :style="{
          background: getBackground(+item.price, +item.total),
        }"
      >
        <td>{{ Number(item.price).toFixed(5) }}</td>
        <td>{{ Number(item.quantity).toFixed(5) }}</td>
        <td v-if="headers.length > 2">
          {{ Number(item.total).toFixed(5) }}
        </td>
      </tr>
    </template>
  </v-data-table-virtual>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { ICTableOrdersProps } from './types';

const props = defineProps<ICTableOrdersProps>();

const theme = {
  ask: {
    backgroundColor: 'rgba(255, 3, 114, 0.15)'
  },
  bid: {
    backgroundColor: 'rgba(0, 197, 130, 0.15)'
  },
};

const display = useDisplay();
const headers = computed(() => {
  const tableHeaders = [
    { "title": "Price", "value": "price" },
    { "title": "Quantity", "value": "quantity", },
  ];

  if (display?.mdAndUp.value) {
    tableHeaders.push({ "title": "Total", "value": "total", });
  }

  return tableHeaders;
});

const getBackground = (price: number, total: number): string => {
  const bgWidth = Math.min(100 - Math.floor((total/price) * 100), 100) + '%';

  return `linear-gradient(90deg, rgba(0,0,0,0) ${bgWidth}, ${theme[props.theme].backgroundColor} ${bgWidth})`;
};
</script>
