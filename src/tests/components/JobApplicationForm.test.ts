import { describe, it, expect, vi, beforeEach } from "vitest";
import JobApplicationForm from "@/components/JobApplicationForm.vue";
import type { JobApplication as JobApplicationType } from "@/api/jobService";
import { mountWithMocks, flushPromises } from "../test-utils";

// Mock the useDebounce composable to avoid timing issues
vi.mock("@/composables/useDebounce", () => ({
  useDebounce: (value: any) => value, // Return the ref directly without debouncing
}));

const mockJob: JobApplicationType = {
  id: "1",
  company: "Tech Corp",
  position: "Frontend Developer",
  status: "Applied",
  dateApplied: "2024-01-15",
  location: "San Francisco",
  salary: 120000,
  description: "Great opportunity",
  notes: "Applied via LinkedIn",
  contactPerson: "John Doe",
  contactEmail: "john@techcorp.com",
  applicationUrl: "https://techcorp.com/careers",
};

describe("JobApplicationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form in add mode", () => {
    const wrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "add",
      },
    });

    expect(wrapper.find('[data-testid="company-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="position-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="location-input"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Create Job");
  });

  it("renders form in edit mode with job data", async () => {
    const wrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "edit",
        job: mockJob,
      },
    });

    // Wait for component to initialize
    await flushPromises();

    // Test input values using data-testid
    const companyInput = wrapper.find('[data-testid="company-input"]')
      .element as HTMLInputElement;
    const positionInput = wrapper.find('[data-testid="position-input"]')
      .element as HTMLInputElement;
    const locationInput = wrapper.find('[data-testid="location-input"]')
      .element as HTMLInputElement;

    expect(companyInput.value).toBe("Tech Corp");
    expect(positionInput.value).toBe("Frontend Developer");
    expect(locationInput.value).toBe("San Francisco");
    expect(wrapper.text()).toContain("Save Changes");
  });

  it("validates required fields when submitted", async () => {
    const wrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "add",
      },
    });

    // Try to submit without filling required fields
    await wrapper.find('[data-testid="submit-button"]').trigger("click");
    await flushPromises();

    // Check for validation error messages
    expect(wrapper.text()).toContain("Company name is required");
    expect(wrapper.text()).toContain("Position is required");
    expect(wrapper.text()).toContain("Location is required");
  });

  it("emits submit event with form data when valid", async () => {
    const wrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "add",
      },
    });

    // Fill required fields
    await wrapper
      .find('[data-testid="company-input"]')
      .setValue("Test Company");
    await wrapper.find('[data-testid="position-input"]').setValue("Developer");
    await wrapper.find('[data-testid="location-input"]').setValue("Remote");

    // Submit form
    await wrapper.find('[data-testid="submit-button"]').trigger("click");
    await flushPromises();

    // Check that submit event was emitted
    expect(wrapper.emitted("submit")).toBeTruthy();

    const emittedData = wrapper.emitted("submit")![0][0] as JobApplicationType;
    expect(emittedData.company).toBe("Test Company");
    expect(emittedData.position).toBe("Developer");
    expect(emittedData.location).toBe("Remote");
  });

  it("emits cancel event when cancel button is clicked", async () => {
    const wrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "add",
      },
    });

    await wrapper.find('[data-testid="cancel-button"]').trigger("click");

    expect(wrapper.emitted("cancel")).toBeTruthy();
  });

  it("shows correct button text based on mode", () => {
    // Test add mode
    const addWrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "add",
      },
    });
    expect(addWrapper.find('[data-testid="submit-button"]').text()).toContain(
      "Create Job"
    );

    // Test edit mode
    const editWrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "edit",
        job: mockJob,
      },
    });
    expect(editWrapper.find('[data-testid="submit-button"]').text()).toContain(
      "Save Changes"
    );
  });

  it("populates all form fields in edit mode", async () => {
    const wrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "edit",
        job: mockJob,
      },
    });

    await flushPromises();

    // Test all form inputs
    const companyInput = wrapper.find('[data-testid="company-input"]')
      .element as HTMLInputElement;
    const positionInput = wrapper.find('[data-testid="position-input"]')
      .element as HTMLInputElement;
    const locationInput = wrapper.find('[data-testid="location-input"]')
      .element as HTMLInputElement;

    expect(companyInput.value).toBe(mockJob.company);
    expect(positionInput.value).toBe(mockJob.position);
    expect(locationInput.value).toBe(mockJob.location);
  });

  it("validates email format", async () => {
    const wrapper = mountWithMocks(JobApplicationForm, {
      props: {
        mode: "add",
      },
    });

    // Fill required fields first
    await wrapper
      .find('[data-testid="company-input"]')
      .setValue("Test Company");
    await wrapper.find('[data-testid="position-input"]').setValue("Developer");
    await wrapper.find('[data-testid="location-input"]').setValue("Remote");

    // Add invalid email
    const emailInput = wrapper.find("#contactEmail");
    await emailInput.setValue("invalid-email");
    await emailInput.trigger("blur");

    // Try to submit
    await wrapper.find('[data-testid="submit-button"]').trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("Invalid email format");
  });
});
