import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSearchStore = create(
  persist(
    (set) => ({
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),
      clearSearchResults: () => set({ searchResults: [] }),
      clearStorage: () => {
        set({ searchResults: [] }); // Reset state
        localStorage.removeItem("search-storage"); // Remove from localStorage
      },
    }),
    {
      name: "search-storage", // Name for localStorage key
    }
  )
);
