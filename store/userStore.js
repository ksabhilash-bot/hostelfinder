import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      uid: null,
      name: null,
      email: null,
      role: "normaluser",
      image: null, // ✅ add image

      setUser: (user) => set(user),
      clearUser: () =>
        set({
          uid: null,
          name: null,
          email: null,
          role: "normaluser",
          image: null,
        }),
    }),
    {
      name: "user-storage", // key in localStorage
    }
  )
);
