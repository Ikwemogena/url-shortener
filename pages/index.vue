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
        <div class="space-y-4">
          <h2 class="text-2xl font-bold mb-4 text-center">URL Shortener</h2>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label for="url" class="block text-sm font-medium text-gray-700"
                >Enter your URL</label
              >
              <input
                v-model="url"
                type="url"
                id="url"
                name="url"
                placeholder="https://example.com"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                for="customUrl"
                class="block text-sm font-medium text-gray-700"
                >Custom short URL (optional)</label
              >
              <input
                v-model="customUrl"
                type="text"
                id="customUrl"
                name="customUrl"
                placeholder="Enter custom alias"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                type="submit"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Shorten URL
              </button>
            </div>
          </form>
          <div
            v-show="isUrlGenerated"
            class="mt-6 p-4 bg-green-100 rounded-lg shadow-md"
          >
            <h3 class="text-lg font-medium text-green-800">Shortened URL:</h3>
            <div class="flex items-center mt-2">
              <p class="text-green-700 break-words flex-grow">
                {{ generatedUrl }}
              </p>
              <button
                type="submit"
                aria-label="Copy URL to clipboard"
                @click="copyToClipboard"
                class="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
              >
                <Icon :name="isCopied ? 'bi:check-lg' : 'bi:copy'" size="18" />
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- QR Code Generator Form -->
      <template v-if="activeTab === 'qrCode'">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold mb-4 text-center">
            QR Code {{ qrCode ? "Generated" : "Generator" }}
          </h2>
          <form
            @submit.prevent="generateQRCode"
            class="space-y-4"
            v-show="!qrCode"
          >
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
    </div>
  </div>
</template>
<script setup lang="ts">
import QRCode from "qrcode";
import { toast } from "vue-sonner";

const activeTab = ref("shortener");
const qrUrl = ref("");
const qrCode = ref("");
const qrCodeDataUrl = ref("");

const { baseUrl } = useRuntimeConfig().public;
const supabase = useSupabase();

const url = ref("");
const customUrl = ref("");
const generatedUrl = ref("");
const isUrlGenerated = ref(false);
const isCopied = ref(false);

const generateShortUrl = async () => {
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${baseUrl}/${randomString}`;
};

const generateUrl = async () => {
  if (!customUrl.value) generatedUrl.value = await generateShortUrl();
  else generatedUrl.value = `${baseUrl}/${customUrl.value}`;

  const payload = {
    long_url: url.value,
    short_url: customUrl.value || generatedUrl.value,
  };

  const { data, error } = await supabase
    .from("links")
    .insert([payload])
    .select();

  if (error) {
    toast.error("An error occurred while shortening the URL");
    isUrlGenerated.value = false;
  }

  if (data) isUrlGenerated.value = true;
};

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

const submitForm = () => {
  generateUrl();
};

const copyToClipboard = () => {
  isCopied.value = true;

  navigator.clipboard.writeText(generatedUrl.value);

  toast.success("Copied to clipboard");

  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};
</script>

<style scoped>
</style>