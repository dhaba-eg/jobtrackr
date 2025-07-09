<script setup lang="ts">
import { useRouter } from "vue-router";
import { useJobStore } from "@/stores/useJobStore";
import { jobsAPI } from "@/api/jobService";
import JobApplicationForm from "@/components/JobApplicationForm.vue";
import type { JobApplication } from "@/api/jobService";

const router = useRouter();
const jobStore = useJobStore();

// Handle form submission for new job
const handleSubmit = async (jobData: Omit<JobApplication, "id">) => {
  try {
    // Create new job via API
    const newJob = await jobsAPI.createJob(jobData);

    // Add the new job to the store
    jobStore.allJobs.push(newJob);

    // Navigate to the jobs list
    router.push("/jobs");
  } catch (err) {
    console.error("Failed to create job:", err);
  }
};

// Handle form cancellation
const handleCancel = () => {
  router.back(); // Go back to wherever you came from
};
</script>

<template>
  <div class="space-y-8 p-6">
    <!-- Add Job Form -->
    <JobApplicationForm
      mode="add"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
