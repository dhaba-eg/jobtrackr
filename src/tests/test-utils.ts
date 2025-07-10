import { vi } from "vitest";
import { mount } from "@vue/test-utils";
import type { Component } from "vue";
import { createRouter, createWebHistory } from "vue-router";

// Mock router for components that use useRouter()
export const createMockRouter = () => {
  const mockRouter = createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", component: { template: "<div>Home</div>" } },
      { path: "/jobs", component: { template: "<div>Jobs</div>" } },
      { path: "/jobs/:id", component: { template: "<div>Job Detail</div>" } },
      {
        path: "/jobs/:id/edit",
        component: { template: "<div>Edit Job</div>" },
      },
    ],
  });

  // Mock the router methods
  mockRouter.push = vi.fn();
  mockRouter.replace = vi.fn();
  mockRouter.back = vi.fn();
  mockRouter.go = vi.fn();

  return mockRouter;
};

// Helper function to mount components with common mocks
export const mountWithMocks = (component: Component, options: any = {}) => {
  const mockRouter = createMockRouter();

  return mount(component, {
    ...options,
    global: {
      plugins: [mockRouter],
      mocks: {
        $router: mockRouter,
        $route: {
          path: "/",
          query: {},
          params: {},
          name: "home",
          meta: {},
        },
      },
      stubs: {
        // Stub teleport components that might cause issues in tests
        Teleport: true,
        RouterLink: true,
        RouterView: true,
        ...options.global?.stubs,
      },
      ...options.global,
    },
  });
};

// Helper to wait for debounced functions
export const waitForDebounce = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper to wait for Vue's next tick and any microtasks
export const flushPromises = () =>
  new Promise((resolve) => setTimeout(resolve, 0));
