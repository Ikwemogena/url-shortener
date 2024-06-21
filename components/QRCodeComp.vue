<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold mb-4 text-center">
      QR Code {{ qrCode ? "Generated" : "Generator" }}
    </h2>
    <form @submit.prevent="generateQRCode" class="space-y-4" v-show="!qrCode">
      <div>
        <label for="qrUrl" class="block text-sm font-medium text-gray-700"
          >Enter your URL</label
        >
        <input
          v-model="qrUrl"
          type="url"
          id="qrUrl"
          name="qrUrl"
          placeholder="https://example.com"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Generate QR Code
        </button>
      </div>
    </form>
    <div
      v-if="qrCode"
      class="mt-6 p-4 bg-green-100 rounded-lg shadow-md text-center"
    >
      <h3 class="text-lg font-medium text-green-800">Your QR Code:</h3>
      <div class="mt-2" v-html="qrCode"></div>
      <a
        :href="qrCodeDataUrl"
        download="qrcode.png"
        class="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Download QR Code
      </a>
      <button
        @click="resetQRCode"
        class="mt-4 inline-block bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Generate Another QR Code
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from "qrcode";

const qrUrl = ref("");
const qrCode = ref("");
const qrCodeDataUrl = ref("");

const generateQRCode = () => {
  QRCode.toDataURL(
    qrUrl.value,
    { width: 400, margin: 2 },
    (err: any, url: string) => {
      if (err) console.error(err);
      qrCode.value = `<img src="${url}" alt="QR Code">`;
      qrCodeDataUrl.value = url;
    }
  );
};

const resetQRCode = () => {
  qrCode.value = "";
  qrCodeDataUrl.value = "";
  qrUrl.value = "";
};
</script>

<style scoped>
</style>