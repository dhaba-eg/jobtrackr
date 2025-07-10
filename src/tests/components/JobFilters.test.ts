import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import JobFilters from "@/components/JobFilters.vue";
import { mountWithMocks, waitForDebounce, flushPromises } from "../test-utils";

// Mock the useDebounce composable
vi.mock("@/composables/useDebounce", () => ({
  useDebounce: vi.fn((value, delay) => {
    // Return a ref that updates immediately for testing
    return value;
  }),
}));

describe("JobFilters", () => {
  const defaultProps = {
    filters: {
      status: null,
      search: null,
      sort: "newest",
    },
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all filter elements", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: defaultProps,
    });

    await flushPromises();

    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true);
    // Check if the Select components exist by looking for their button elements
    expect(wrapper.findAll("button").length).toBeGreaterThan(0);
    expect(wrapper.find('[data-testid="clear-button"]').exists()).toBe(true);

    // Check that the component contains filter-related text
    expect(wrapper.text()).toContain("Status");
    expect(wrapper.text()).toContain("Sort by");
  });

  it("displays correct placeholder text", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: defaultProps,
    });

    await flushPromises();

    const searchInput = wrapper.find('[data-testid="search-input"]');
    expect(searchInput.attributes("placeholder")).toBe(
      "Search companies or positions..."
    );
  });

  it("emits filters-change when search input changes", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: defaultProps,
    });

    await flushPromises();

    const searchInput = wrapper.find('[data-testid="search-input"]');
    await searchInput.setValue("tech company");
    await nextTick();

    expect(wrapper.emitted("filters-change")).toBeTruthy();
    const emittedEvents = wrapper.emitted("filters-change") as Array<
      Array<any>
    >;
    const lastEmittedEvent = emittedEvents[emittedEvents.length - 1][0];

    expect(lastEmittedEvent).toEqual({
      search: "tech company",
      status: null,
      sort: "newest",
    });
  });

  it("initializes with provided filter values", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: {
        filters: {
          status: "Applied",
          search: "software engineer",
          sort: "company-asc",
        },
        loading: false,
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('[data-testid="search-input"]');
    expect((searchInput.element as HTMLInputElement).value).toBe(
      "software engineer"
    );
  });

  it("clears search input when clear button is clicked", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: {
        filters: {
          status: "Applied",
          search: "tech",
          sort: "company-asc",
        },
        loading: false,
      },
    });

    await flushPromises();

    // Verify initial state
    const searchInput = wrapper.find('[data-testid="search-input"]');
    expect((searchInput.element as HTMLInputElement).value).toBe("tech");

    // Click clear button
    await wrapper.find('[data-testid="clear-button"]').trigger("click");
    await nextTick();

    // Verify search is cleared
    expect((searchInput.element as HTMLInputElement).value).toBe("");

    // Verify filters-change event is emitted with cleared values
    expect(wrapper.emitted("filters-change")).toBeTruthy();
    const emittedEvents = wrapper.emitted("filters-change") as Array<
      Array<any>
    >;
    const lastEmittedEvent = emittedEvents[emittedEvents.length - 1][0];

    expect(lastEmittedEvent).toEqual({
      search: null,
      status: null,
      sort: "newest",
    });
  });

  it("disables inputs when loading", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: {
        ...defaultProps,
        loading: true,
      },
    });

    await flushPromises();

    const searchInput = wrapper.find('[data-testid="search-input"]');
    expect(searchInput.attributes("disabled")).toBeDefined();

    const clearButton = wrapper.find('[data-testid="clear-button"]');
    expect(clearButton.attributes("disabled")).toBeDefined();
  });

  it("emits correct filter values when search is cleared manually", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: {
        filters: {
          status: null,
          search: "initial search",
          sort: "newest",
        },
        loading: false,
      },
    });

    await flushPromises();

    // Clear the search input manually
    const searchInput = wrapper.find('[data-testid="search-input"]');
    await searchInput.setValue("");
    await nextTick();

    expect(wrapper.emitted("filters-change")).toBeTruthy();
    const emittedEvents = wrapper.emitted("filters-change") as Array<
      Array<any>
    >;
    const lastEmittedEvent = emittedEvents[emittedEvents.length - 1][0];

    expect(lastEmittedEvent.search).toBe(null);
  });

  it("shows correct button state when disabled", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: {
        ...defaultProps,
        loading: true,
      },
    });

    await flushPromises();

    const clearButton = wrapper.find('[data-testid="clear-button"]');
    expect(clearButton.attributes("disabled")).toBeDefined();
  });

  it("maintains filter state consistency", async () => {
    const wrapper = mountWithMocks(JobFilters, {
      props: {
        filters: {
          status: "Interview",
          search: "vue developer",
          sort: "salary-high",
        },
        loading: false,
      },
    });

    await flushPromises();

    // Check that the component correctly initializes with the provided filters
    const searchInput = wrapper.find('[data-testid="search-input"]');
    expect((searchInput.element as HTMLInputElement).value).toBe(
      "vue developer"
    );

    // Change the search and verify the emitted event contains all current filter values
    await searchInput.setValue("react developer");
    await nextTick();

    const emittedEvents = wrapper.emitted("filters-change") as Array<
      Array<any>
    >;
    const lastEmittedEvent = emittedEvents[emittedEvents.length - 1][0];

    // The component should maintain the current filter state (not revert to defaults)
    expect(lastEmittedEvent).toEqual({
      search: "react developer",
      status: "Interview", // Should maintain current status
      sort: "salary-high", // Should maintain current sort
    });
  });
});
