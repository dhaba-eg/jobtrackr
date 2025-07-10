import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTheme } from "@/composables/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Reset document classes
    document.documentElement.className = "";

    // Reset matchMedia mock
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("initializes with system theme by default", () => {
    const { theme, isDark } = useTheme();

    expect(theme.value).toBe("system");
    expect(isDark.value).toBe(false);
  });

  it("sets theme to dark", () => {
    const { setTheme, isDark } = useTheme();

    setTheme("dark");

    expect(isDark.value).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("sets theme to light", () => {
    const { setTheme, isDark } = useTheme();

    setTheme("light");

    expect(isDark.value).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("toggles theme correctly", () => {
    const { toggleTheme, isDark } = useTheme();

    // Start with light
    expect(isDark.value).toBe(false);

    // Toggle to dark
    toggleTheme();
    expect(isDark.value).toBe(true);

    // Toggle back to light
    toggleTheme();
    expect(isDark.value).toBe(false);
  });

  it("respects system preference when theme is system", () => {
    // Mock system dark preference
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { initTheme, isDark } = useTheme();
    initTheme();

    expect(isDark.value).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
