import { jobsAPI } from "@/api/jobService";
import type { JobApplication } from "@/api/jobService";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useJobStore = defineStore("jobs", () => {
  const jobs = ref<JobApplication[]>([]);
  const isLoading = ref<boolean>(false);
  const isError = ref<null | string>(null);

  const jobCounts = computed(() => ({
    applied: jobs.value.filter((job) => job.status === "Applied").length,
    interview: jobs.value.filter((job) => job.status === "Interview").length,
    offer: jobs.value.filter((job) => job.status === "Offer").length,
    rejected: jobs.value.filter((job) => job.status === "Rejected").length,
    total: jobs.value.length,
  }));

  const fetchJobs = async () => {
    isLoading.value = true;
    try {
      const response = await jobsAPI.getJobs();
      jobs.value = response;
    } catch (error) {
      console.error(error);
      isError.value =
        error instanceof Error ? error.message : "An error occurred";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    jobs,
    isLoading,
    isError,
    // Getters
    jobCounts,
    // Actions
    fetchJobs,
  };
});
