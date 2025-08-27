<template>
  <div>
    <UApp :toaster="toaster">
      <NuxtPage />
    </UApp>
  </div>
</template>

<script setup lang="ts">
const toaster = { position: 'top-right' }
</script>
