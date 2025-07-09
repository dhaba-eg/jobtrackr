<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobStore } from "@/stores/useJobStore";

// Components
import DashboardStats from "@/components/DashboardStats.vue";
import JobFilters from "@/components/JobFilters.vue";
import JobsGrid from "@/components/JobsGrid.vue";

const jobStore = useJobStore();
const route = useRoute();
const router = useRouter();

// Flag to prevent infinite loops
const isUpdatingFromURL = ref(false);

// Safer URL update function
const updateURL = (filters: {
  status?: string | null;
  search?: string | null;
  sort?: string | null;
}) => {
  const query: Record<string, string> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search?.trim()) {
    query.search = filters.search.trim();
  }

  if (filters.sort && filters.sort !== "newest") {
    query.sort = filters.sort;
  }

  // Use replace instead of push to avoid navigation stack issues
  router.replace({
    path: route.path,
    query: Object.keys(query).length > 0 ? query : undefined,
  });
};

// Handle filter changes from child components
const handleFiltersChange = (newFilters: {
  status?: string | null;
  search?: string | null;
  sort?: string | null;
}) => {
  if (isUpdatingFromURL.value) return; // Prevent loop

  jobStore.setFilters(newFilters);
  updateURL(newFilters);
};

onMounted(() => {
  const urlFilters = {
    status: (route.query.status as string | null) || null,
    search: (route.query.search as string | null) || null,
    sort: (route.query.sort as string | null) || "newest",
  };

  const currentFilters = jobStore.activeFilters;

  // Only update if filters have actually changed
  if (
    currentFilters.status !== urlFilters.status ||
    currentFilters.search !== urlFilters.search ||
    currentFilters.sort !== urlFilters.sort
  ) {
    jobStore.setFilters(urlFilters);
  }
});

watch(
  () => route.query,
  (newQuery) => {
    isUpdatingFromURL.value = true;

    const urlFilters = {
      status: (newQuery.status as string | null) || null,
      search: (newQuery.search as string | null) || null,
      sort: (newQuery.sort as string | null) || "newest",
    };

    jobStore.setFilters(urlFilters);

    // Reset flag after a tick
    nextTick(() => {
      isUpdatingFromURL.value = false;
    });
  },
  { deep: true }
);
</script>

<template>
  <div class="space-y-8 p-6">
    <!-- Dashboard Stats Section -->
    <DashboardStats
      :counts="jobStore.jobCounts"
      :loading="jobStore.isLoading"
    />

    <!-- Search and Filter Section -->
    <JobFilters
      :filters="jobStore.activeFilters"
      :loading="jobStore.isLoading"
      @filters-change="handleFiltersChange"
    />

    <!-- Jobs Grid Section -->
    <JobsGrid
      :jobs="jobStore.sortedJobs"
      :loading="jobStore.isLoading"
      :error="jobStore.isError"
    />
  </div>
</template>
