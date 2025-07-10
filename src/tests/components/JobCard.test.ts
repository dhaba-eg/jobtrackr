import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import JobCard from "@/components/JobCard.vue";
import type { JobApplication } from "@/api/jobService";

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/jobs/:id",
      name: "job-detail",
      component: { template: "<div>Job Detail</div>" },
    },
    {
      path: "/edit/:id",
      name: "edit-job",
      component: { template: "<div>Edit Job</div>" },
    },
  ],
});

const mockJob: JobApplication = {
  id: "1",
  company: "Tech Corp",
  position: "Frontend Developer",
  status: "Applied",
  dateApplied: "2024-01-15",
  salary: 80000,
  location: "San Francisco, CA",
  description: "Great opportunity",
  notes: "Follow up next week",
  contactPerson: "John Doe",
  contactEmail: "john@techcorp.com",
  applicationUrl: "https://techcorp.com/jobs/123",
};

describe("JobCard", () => {
  it("renders job information correctly", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("Tech Corp");
    expect(wrapper.text()).toContain("Frontend Developer");
    expect(wrapper.text()).toContain("Applied");
    expect(wrapper.text()).toContain("Jan 15, 2024");
  });

  it("displays salary when provided", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("$80K");
  });

  it("displays location when salary is not provided", () => {
    const jobWithoutSalary = { ...mockJob, salary: undefined };
    const wrapper = mount(JobCard, {
      props: { job: jobWithoutSalary },
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("San Francisco, CA");
  });

  it("shows correct status badge color for Applied status", () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [router],
      },
    });

    const badge = wrapper.find('[data-testid="status-badge"]');
    expect(badge.classes()).toContain("bg-chart-1/10");
  });

  it("handles view job button click", async () => {
    const push = vi.spyOn(router, "push");
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [router],
      },
    });

    await wrapper.find('[data-testid="view-job-btn"]').trigger("click");
    expect(push).toHaveBeenCalledWith("/jobs/1");
  });

  it("handles edit job button click", async () => {
    const push = vi.spyOn(router, "push");
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        plugins: [router],
      },
    });

    await wrapper.find('[data-testid="edit-job-btn"]').trigger("click");
    expect(push).toHaveBeenCalledWith("/edit/1");
  });
});
