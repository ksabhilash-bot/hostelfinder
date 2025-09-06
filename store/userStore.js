import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create()(
  persist(
    (set) => ({
      id: null,
      uid: null,
      name: null,
      email: null,
      role: "normaluser",
      image: null,

      setUser: (user) => set(user),

      clearUser: () => {
        // Reset in-memory state
        set({
          id: null,
          uid: null,
          name: null,
          email: null,
          role: "normaluser",
          image: null,
        });
        // Remove persisted state from localStorage
        localStorage.removeItem("user-storage");
      },
    }),
    {
      name: "user-storage", // key for persisted storage
      // optional: versioning to help with migrations
      version: 1,
    }
  )
);
