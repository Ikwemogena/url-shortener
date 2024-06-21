<template>
  <section class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold mb-4">Redirecting...</h2>
      <p class="mb-4">You will be redirected to your destination shortly.</p>
      <p class="mb-8">
        If you are not redirected,
        <a
          id="redirectLink"
          :href="data?.long_url || '/'"
          class="text-indigo-600 hover:text-indigo-800"
          >click here</a
        >.
      </p>
      <div
        class="loader border-t-4 border-indigo-500 rounded-full w-16 h-16 mx-auto"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { url } = useRoute().params;
const supabase = useSupabase();

const { data, error } = await supabase
  .from("links")
  .select("*")
  .eq("short_url", url)
  .single();

if (error) {
  navigateTo("/");
}

if (data) {
  navigateTo(data.long_url, { external: true });
  console.log(data);
}
</script>

<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>