<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
      <div class="flex mb-4">
        <button
          :class="{
            'w-1/2 py-2 text-center rounded-tl-lg rounded-bl-lg': true,
            'bg-indigo-600 text-white': activeTab === 'shortener',
            'bg-gray-300': activeTab !== 'shortener',
          }"
          @click="activeTab = 'shortener'"
        >
          URL Shortener
        </button>
        <button
          :class="{
            'w-1/2 py-2 text-center rounded-tr-lg rounded-br-lg': true,
            'bg-indigo-600 text-white': activeTab === 'qrCode',
            'bg-gray-300': activeTab !== 'qrCode',
          }"
          @click="activeTab = 'qrCode'"
        >
          QR Code Generator
        </button>
      </div>

      <!-- URL Shortener Form -->
      <template v-if="activeTab === 'shortener'">
        <URLShortenerComp />
      </template>

      <!-- QR Code Generator Form -->
      <template v-if="activeTab === 'qrCode'">
        <QRCodeComp />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref("shortener");

</script>

<style scoped>
</style>