import { jobsAPI } from "@/api/jobService";
import type { JobApplication } from "@/api/jobService";
import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";

// Sorting utility function
const sortJobs = (jobs: JobApplication[], sortBy: string): JobApplication[] => {
  const sorted = [...jobs]; // Don't mutate original array

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
      );

    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime()
      );

    case "company-asc":
      return sorted.sort((a, b) => a.company.localeCompare(b.company));

    case "company-desc":
      return sorted.sort((a, b) => b.company.localeCompare(a.company));

    case "salary-high":
      return sorted.sort((a, b) => {
        const salaryA = a.salary ?? 0;
        const salaryB = b.salary ?? 0;
        return salaryB - salaryA;
      });

    case "salary-low":
      return sorted.sort((a, b) => {
        const salaryA = a.salary ?? Number.MAX_VALUE;
        const salaryB = b.salary ?? Number.MAX_VALUE;
        return salaryA - salaryB;
      });

    default:
      return sorted;
  }
};

// Client-side filtering function
const filterJobs = (
  jobs: JobApplication[],
  filters: { status?: string | null; search?: string | null }
): JobApplication[] => {
  let filtered = [...jobs];

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((job) => job.status === filters.status);
  }

  // Filter by search (company or position)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.company.toLowerCase().includes(searchLower) ||
        job.position.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

export const useJobStore = defineStore("jobs", () => {
  const allJobs = ref<JobApplication[]>([]); // Store all jobs from server
  const isLoading = ref<boolean>(false);
  const isError = ref<null | string>(null);

  const activeFilters = ref({
    status: null as string | null,
    search: null as string | null,
    sort: "newest" as string,
  });

  // Step 1: Apply filters to all jobs (client-side)
  const filteredJobs = computed(() => {
    return filterJobs(allJobs.value, activeFilters.value);
  });

  // Step 2: Apply sorting to filtered results
  const sortedJobs = computed(() => {
    return sortJobs(filteredJobs.value, activeFilters.value.sort);
  });

  // Step 3: Calculate counts based on filtered results
  const jobCounts = computed(() => ({
    applied: filteredJobs.value.filter((job) => job.status === "Applied")
      .length,
    interview: filteredJobs.value.filter((job) => job.status === "Interview")
      .length,
    offer: filteredJobs.value.filter((job) => job.status === "Offer").length,
    rejected: filteredJobs.value.filter((job) => job.status === "Rejected")
      .length,
    total: filteredJobs.value.length,
  }));

  // Fetch all jobs from server (called only once or when data needs refresh)
  const fetchJobs = async () => {
    // Don't refetch if data already exists
    if (allJobs.value.length > 0) {
      console.log("fetchJobs: early return - data exists");
      return;
    }

    isLoading.value = true;
    try {
      const response = await jobsAPI.getJobs();
      allJobs.value = response;
    } catch (error) {
      console.error(error);
      isError.value =
        error instanceof Error ? error.message : "An error occurred";
    } finally {
      isLoading.value = false;
    }
  };

  // Update filters (no API call needed!)
  const setFilters = (filters: {
    status?: string | null;
    search?: string | null;
    sort?: string | null;
  }) => {
    activeFilters.value = {
      ...activeFilters.value,
      ...filters,
      sort: filters.sort || "newest",
    };
  };

  // Add this to the actions section
  const deleteJob = async (jobId: string) => {
    try {
      await jobsAPI.deleteJob(jobId);

      // Remove the job from the store
      const index = allJobs.value.findIndex((job) => job.id === jobId);
      if (index !== -1) {
        allJobs.value.splice(index, 1);
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      throw error; // Re-throw so components can handle the error
    }
  };

  return {
    // State
    allJobs,
    isLoading,
    isError,
    activeFilters: readonly(activeFilters),
    // Getters
    jobCounts,
    filteredJobs,
    sortedJobs,
    deleteJob,
    // Actions
    fetchJobs,
    setFilters,
  };
});
