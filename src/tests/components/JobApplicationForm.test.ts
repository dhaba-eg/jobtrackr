import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import JobApplication from "@/components/JobApplicationForm.vue";
import type { JobApplication as JobApplicationType } from "@/api/jobService";

const mockJob: JobApplicationType = {
  id: "1",
  company: "Tech Corp",
  position: "Frontend Developer",
  status: "Applied",
  dateApplied: "2024-01-15",
  location: "San Francisco",
};

describe("JobApplication Form", () => {
  it("renders form in add mode", () => {
    const wrapper = mount(JobApplication, {
      props: {
        mode: "add",
      },
    });

    expect(
      wrapper.find('input[placeholder="Enter company name"]').exists()
    ).toBe(true);
    expect(
      wrapper.find('input[placeholder="Enter position title"]').exists()
    ).toBe(true);
    expect(wrapper.text()).toContain("Create Job");
  });

  it("renders form in edit mode with job data", () => {
    const wrapper = mount(JobApplication, {
      props: {
        mode: "edit",
        job: mockJob,
      },
    });

    expect(
      wrapper.find('input[placeholder="Enter company name"]').element.value
    ).toBe("Tech Corp");
    expect(
      wrapper.find('input[placeholder="Enter position title"]').element.value
    ).toBe("Frontend Developer");
    expect(wrapper.text()).toContain("Save Changes");
  });

  it("validates required fields", async () => {
    const wrapper = mount(JobApplication, {
      props: {
        mode: "add",
      },
    });

    // Submit without filling required fields
    await wrapper.find('button[type="button"]').trigger("click");

    expect(wrapper.text()).toContain("Company name is required");
    expect(wrapper.text()).toContain("Position is required");
    expect(wrapper.text()).toContain("Location is required");
  });

  it("emits submit event with form data", async () => {
    const wrapper = mount(JobApplication, {
      props: {
        mode: "add",
      },
    });

    // Fill form
    await wrapper
      .find('input[placeholder="Enter company name"]')
      .setValue("Test Company");
    await wrapper
      .find('input[placeholder="Enter position title"]')
      .setValue("Developer");
    await wrapper
      .find('input[placeholder="e.g. San Francisco, CA or Remote"]')
      .setValue("Remote");

    // Submit form
    await wrapper.find('button[type="button"]:last-child').trigger("click");

    expect(wrapper.emitted("submit")).toBeTruthy();
    const emittedData = wrapper.emitted("submit")![0][0] as JobApplicationType;
    expect(emittedData.company).toBe("Test Company");
    expect(emittedData.position).toBe("Developer");
    expect(emittedData.location).toBe("Remote");
  });

  it("emits cancel event when cancel button is clicked", async () => {
    const wrapper = mount(JobApplication, {
      props: {
        mode: "add",
      },
    });

    await wrapper.find('button[variant="outline"]').trigger("click");

    expect(wrapper.emitted("cancel")).toBeTruthy();
  });
});
