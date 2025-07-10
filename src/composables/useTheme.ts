import { ref, readonly } from "vue";

type Theme = "light" | "dark" | "system";

const theme = ref<Theme>("system");
const isDark = ref(false);

export function useTheme() {
  // Get theme from localStorage or default to system
  const getStoredTheme = (): Theme => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as Theme) || "system";
  };

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      isDark.value = systemDark;
      root.classList.toggle("dark", systemDark);
    } else {
      isDark.value = newTheme === "dark";
      root.classList.toggle("dark", newTheme === "dark");
    }
  };

  // Set theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Toggle between light and dark (skip system)
  const toggleTheme = () => {
    const newTheme = isDark.value ? "light" : "dark";
    setTheme(newTheme);
  };

  // Initialize theme
  const initTheme = () => {
    theme.value = getStoredTheme();
    applyTheme(theme.value);

    // Listen for system theme changes
    if (theme.value === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", () => {
        if (theme.value === "system") {
          applyTheme("system");
        }
      });
    }
  };

  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    setTheme,
    toggleTheme,
    initTheme,
  };
}
