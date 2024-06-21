<template>
  <div></div>
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
</style>