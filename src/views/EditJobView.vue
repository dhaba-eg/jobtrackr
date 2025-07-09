<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobStore } from "@/stores/useJobStore";
import { jobsAPI } from "@/api/jobService";
import JobApplicationForm from "@/components/JobApplicationForm.vue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-vue-next";
import type { JobApplication } from "@/api/jobService";

const route = useRoute();
const router = useRouter();
const jobStore = useJobStore();

const job = ref<JobApplication | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Load job data
onMounted(async () => {
  try {
    const jobId = route.params.id as string;

    if (jobStore.allJobs.length === 0) {
      await jobStore.fetchJobs();
    }

    const foundJob = jobStore.allJobs.find((j) => j.id === jobId);

    if (!foundJob) {
      error.value = "Job not found";
      return;
    }

    job.value = foundJob;
  } catch (err) {
    error.value = "Failed to load job details";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

// Handle form submission
const handleSubmit = async (jobData: JobApplication) => {
  try {
    const updatedJob = await jobsAPI.updateJob(jobData.id, jobData);

    const index = jobStore.allJobs.findIndex((job) => job.id === updatedJob.id);
    if (index !== -1) {
      jobStore.allJobs[index] = updatedJob;
    }

    router.back();
  } catch (err) {
    console.error("Failed to update job:", err);
  }
};

// Handle form cancellation
const handleCancel = () => {
  router.back();
};

// Fallback navigation for error states
const goBack = () => {
  // Get current filters from the store
  const currentFilters = jobStore.activeFilters;

  // Build query object from current filters
  const query: Record<string, string> = {};

  if (currentFilters.status) {
    query.status = currentFilters.status;
  }

  if (currentFilters.search?.trim()) {
    query.search = currentFilters.search.trim();
  }

  if (currentFilters.sort && currentFilters.sort !== "newest") {
    query.sort = currentFilters.sort;
  }

  // Navigate back to jobs list with preserved filters
  router.push({
    path: "/jobs",
    query: Object.keys(query).length > 0 ? query : undefined,
  });
};
</script>

<template>
  <div class="space-y-8 p-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="mx-auto space-y-6">
      <Skeleton class="h-48" />
      <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Skeleton class="h-64" />
        <Skeleton class="h-64" />
        <Skeleton class="h-64" />
        <Skeleton class="h-64" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mx-auto text-center py-12">
      <div class="text-destructive text-xl font-semibold mb-4">{{ error }}</div>
      <Button @click="goBack" variant="outline">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>
    </div>

    <!-- Edit Form -->
    <JobApplicationForm
      v-else-if="job"
      mode="edit"
      :job="job"
      back-button-text="Back"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
