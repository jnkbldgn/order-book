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
          icon="mdi-cog-outline"
          color="primary"
          size="large"
        />
        <v-btn
          to="order-book"
          variant="text"
          icon="mdi-book-open-variant-outline"
          color="primary"
          size="large"
        />
      </div>
    </template>
  </v-app-bar>
</template>
