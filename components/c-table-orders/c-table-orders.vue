<template>
  <v-data-table-virtual
    class="c-table-orders"
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
      <tr class="c-table-orders__order">
        <td>{{ Number(item.price).toFixed(5) }}</td>
        <td>{{ Number(item.quantity).toFixed(5) }}</td>
        <td v-if="headers.length > 2">
          {{ Number(item.total).toFixed(5) }}
        </td>
        <span
          class="c-table-orders__order-bg"
          :style="{
            width: Math.floor(Math.random() * 100) + '%',
            backgroundColor: theme[props.theme].backgroundColor,
          }"
        />
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
</script>

<style>
  .c-table-orders__order {
    position: relative;
  }

  .c-table-orders__order-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
  }
</style>
