<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold mb-4 text-center">URL Shortener</h2>
    <form @submit.prevent="generateUrl" class="space-y-4">
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
        <label for="customUrl" class="block text-sm font-medium text-gray-700"
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

<script setup lang="ts">
import { toast } from "vue-sonner";

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