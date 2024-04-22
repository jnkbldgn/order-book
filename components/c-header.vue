<template>
  <v-app-bar :elevation="3">
    <template #prepend>
      <v-btn
        to="/"
        icon="mdi-baby-face"
        variant="text"
        size="large"
        color="primary"
      />
    </template>

    <v-app-bar-title class="text-body-1 text-uppercase">
      <slot />
    </v-app-bar-title>

    <template #append>
      <div>
        <v-btn
          to="settings"
          variant="text"
          text="settings"
          size="small"
          prepend-icon="mdi-cog-outline"
          stacked
          color="primary"
          rounded="0"
        />
        <v-btn
          to="order-book"
          variant="text"
          size="small"
          text="order book"
          prepend-icon="mdi-book-open-variant-outline"
          stacked
          color="primary"
          rounded="0"
        />
      </div>
    </template>
  </v-app-bar>
</template>
