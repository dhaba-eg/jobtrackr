<script setup lang="ts">
import { onMounted } from "vue";
import { useJobStore } from "@/stores/useJobStore";
import MainLayout from "@/layouts/MainLayout.vue";

const jobStore = useJobStore();

onMounted(async () => {
  if (jobStore.allJobs.length === 0) {
    await jobStore.fetchJobs();
  }
});
</script>

<template>
  <MainLayout />
</template>
