<template>
  <Toaster position="top-right" richColors />
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { Toaster, toast } from "vue-sonner";
</script>

