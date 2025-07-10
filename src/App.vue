<script setup lang="ts">
import { onMounted } from "vue";
import { useJobStore } from "@/stores/useJobStore";
import { useTheme } from "@/composables/useTheme";
import MainLayout from "@/layouts/MainLayout.vue";

const jobStore = useJobStore();
const { initTheme } = useTheme();

onMounted(async () => {
  initTheme();

  if (jobStore.allJobs.length === 0) {
    await jobStore.fetchJobs();
  }
});
</script>

<template>
  <MainLayout />
</template>
