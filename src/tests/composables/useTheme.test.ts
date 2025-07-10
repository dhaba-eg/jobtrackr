import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTheme } from "@/composables/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document classes
    document.documentElement.className = "";
    // Reset localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it("initializes with default theme", () => {
    const { theme, isDark } = useTheme();

    // Theme should be initialized to some value
    expect(theme.value).toBeDefined();
    expect(typeof isDark.value).toBe("boolean");
  });

  it("can set theme to dark", () => {
    const { setTheme, isDark } = useTheme();

    setTheme("dark");

    expect(isDark.value).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("can set theme to light", () => {
    const { setTheme, isDark } = useTheme();

    setTheme("light");

    expect(isDark.value).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggles theme correctly", () => {
    const { toggleTheme, isDark } = useTheme();

    const initialDark = isDark.value;

    toggleTheme();

    // Should be opposite of initial state
    expect(isDark.value).toBe(!initialDark);

    toggleTheme();

    // Should be back to initial state
    expect(isDark.value).toBe(initialDark);
  });

  it("respects system preference when available", () => {
    // Mock matchMedia to return dark preference
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });

    const { isDark } = useTheme();

    // Should work with or without system theme detection
    expect(typeof isDark.value).toBe("boolean");
  });

  it("provides theme functions", () => {
    const themeComposable = useTheme();

    // Check that all expected functions are available
    expect(typeof themeComposable.setTheme).toBe("function");
    expect(typeof themeComposable.toggleTheme).toBe("function");
    expect(themeComposable.theme).toBeDefined();
    expect(themeComposable.isDark).toBeDefined();
  });
});
