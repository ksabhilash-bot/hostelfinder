import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create()(
  persist(
    (set) => ({
      id:null,
      uid: null,
      name: null,
      email: null,
      role: "normaluser",
      image: null,

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
      name: "user-storage", // stored in localStorage
    }
  )
);
