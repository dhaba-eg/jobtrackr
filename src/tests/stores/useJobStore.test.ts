import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useJobStore } from "@/stores/useJobStore";
import { jobsAPI } from "@/api/jobService";
import type { JobApplication } from "@/api/jobService";

// Mock the API
vi.mock("@/api/jobService", () => ({
  jobsAPI: {
    getJobs: vi.fn(),
    createJob: vi.fn(),
    updateJob: vi.fn(),
    deleteJob: vi.fn(),
  },
}));

const mockJobs: JobApplication[] = [
  {
    id: "1",
    company: "Tech Corp",
    position: "Frontend Developer",
    status: "Applied",
    dateApplied: "2024-01-15",
    location: "San Francisco",
  },
  {
    id: "2",
    company: "Startup Inc",
    position: "Full Stack Developer",
    status: "Interview",
    dateApplied: "2024-01-10",
    location: "Remote",
  },
  {
    id: "3",
    company: "Big Tech",
    position: "Senior Developer",
    status: "Offer",
    dateApplied: "2024-01-05",
    location: "New York",
  },
];

describe("useJobStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("initializes with empty state", () => {
    const store = useJobStore();

    expect(store.allJobs).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.isError).toBe(null);
    expect(store.activeFilters).toEqual({
      status: null,
      search: null,
      sort: "newest",
    });
  });

  it("fetches jobs successfully", async () => {
    vi.mocked(jobsAPI.getJobs).mockResolvedValue(mockJobs);
    const store = useJobStore();

    await store.fetchJobs();

    expect(store.allJobs).toEqual(mockJobs);
    expect(store.isLoading).toBe(false);
    expect(store.isError).toBe(null);
  });

  it("handles fetch jobs error", async () => {
    const errorMessage = "Network error";
    vi.mocked(jobsAPI.getJobs).mockRejectedValue(new Error(errorMessage));
    const store = useJobStore();

    await store.fetchJobs();

    expect(store.allJobs).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.isError).toBe(errorMessage);
  });

  it("filters jobs by status", () => {
    const store = useJobStore();
    store.allJobs = mockJobs;

    store.setFilters({ status: "Applied" });

    expect(store.filteredJobs).toHaveLength(1);
    expect(store.filteredJobs[0].status).toBe("Applied");
  });

  it("filters jobs by search term", () => {
    const store = useJobStore();
    store.allJobs = mockJobs;

    store.setFilters({ search: "tech" });

    expect(store.filteredJobs).toHaveLength(2); // Tech Corp and Big Tech
  });

  it("sorts jobs correctly", () => {
    const store = useJobStore();
    store.allJobs = mockJobs;

    store.setFilters({ sort: "oldest" });

    expect(store.sortedJobs[0].dateApplied).toBe("2024-01-05");
    expect(store.sortedJobs[2].dateApplied).toBe("2024-01-15");
  });

  it("calculates job counts correctly", () => {
    const store = useJobStore();
    store.allJobs = mockJobs;

    expect(store.jobCounts).toEqual({
      applied: 1,
      interview: 1,
      offer: 1,
      rejected: 0,
      total: 3,
    });
  });

  it("deletes job successfully", async () => {
    vi.mocked(jobsAPI.deleteJob).mockResolvedValue();
    const store = useJobStore();
    store.allJobs = [...mockJobs];

    await store.deleteJob("1");

    expect(store.allJobs).toHaveLength(2);
    expect(store.allJobs.find((job) => job.id === "1")).toBeUndefined();
  });
});
