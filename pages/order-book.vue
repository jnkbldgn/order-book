<template>
  <v-container
    tag="section"
    class="h-100 d-flex flex-column"
  >
    <h1 class="text-h5 text-uppercase">
      Order book
    </h1>

    <c-select
      class="mt-4 flex-0-0"
      :value="currentLimit.value"
      :items="limits"
      hint="You can change the number of orders"
      @change="(item) => changeCurrentLimit(item as ILimit)"
    />

    <div
      class="d-flex flex-column flex-md-row mt-4 pb-4 flex-1-1 overflow-hidden"
    >
      <c-table-orders
        class="order-book__table mb-4 mr-md-0 mr-md-4"
        header="Bid"
        :items="bids.slice(0, currentLimit.value)"
        theme="bid"
        :loading="loading"
      />

      <c-table-orders
        class="order-book__table"
        header="Ask"
        :items="asks.slice(0, currentLimit.value)"
        theme="ask"
        :loading="loading"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useOrderBookStore } from '~/stores/order-book/index';
import type { ILimit } from '~/stores/order-book/types';
import { useSettingsStore } from '~/stores/settings';

const orderBookStore = useOrderBookStore();
const settingsStore = useSettingsStore();

const { changeCurrentLimit, fetchLimits, fetchDepth, openStream, closeStream } = orderBookStore;
const { limits, currentLimit, asks, bids } = storeToRefs(orderBookStore);

const { currentPair } = storeToRefs(settingsStore);

const loading = ref(true);

onServerPrefetch(() => fetchLimits());

onBeforeMount(async () => {
  await fetchDepth(currentPair.value.value);
  openStream(currentPair.value.value);
  loading.value = false;
});

onUnmounted(() => closeStream(currentPair.value.value));
</script>

<style>
.order-book__table {
  height: 50%;

  @media screen and (min-width: 960px) {
    height: 100%;
  }
}
</style>
