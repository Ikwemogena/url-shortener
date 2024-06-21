<template>
  <section class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4 text-center">URL Shortener</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="url" class="block text-sm font-medium text-gray-700"
            >Enter your URL</label
          >
          <input
            type="url"
            name="url"
            v-model="url"
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
            type="text"
            name="customUrl"
            v-model="customUrl"
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
            <Icon name="bi:copy" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { baseUrl } = useRuntimeConfig().public;
const supabase = useSupabase();

const url = ref("");
const customUrl = ref("");
const generatedUrl = ref("");
const isUrlGenerated = ref(false);

const generateShortUrl = async () => {
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${baseUrl}/${randomString}`;
};

const generateUrl = async () => {
  if (!customUrl.value) generatedUrl.value = await generateShortUrl();
  else generatedUrl.value =  `${baseUrl}/${customUrl.value}`;

  const payload = {
    long_url: url.value,
    short_url: customUrl.value || generatedUrl.value,
  };

  const { data, error } = await supabase
    .from("links")
    .insert([payload])
    .select();

  if (error) throw new Error(error.message);

  if (data) isUrlGenerated.value = true;
};

const submitForm = () => {
  generateUrl();
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(generatedUrl.value);
};
</script>

<style scoped>
</style>