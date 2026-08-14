import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

export const useProfileStore = create((set, get) => ({
  profileUser: null,
  profileLoading: false,

  fetchProfile: async (userId) => {
    set({ profileLoading: true, profileUser: null });
    try {
      const res = await axiosInstance.get(`/users/${userId}`);
      set({ profileUser: res.data.user, profileLoading: false });
    } catch (err) {
      console.log(err);
      set({ profileLoading: false });
    }
  },

  addPortfolioItem: async (formData) => {
    const res = await axiosInstance.post("/portfolio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    set({
      profileUser: {
        ...get().profileUser,
        portfolio: [...(get().profileUser?.portfolio || []), res.data],
      },
    });
  },

  editPortfolioItem: async (itemId, formData) => {
    const res = await axiosInstance.patch(`/portfolio/${itemId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    set({
      profileUser: {
        ...get().profileUser,
        portfolio: get().profileUser.portfolio.map((item) =>
          item._id === itemId ? res.data : item
        ),
      },
    });
  },

  deletePortfolioItem: async (itemId) => {
    await axiosInstance.delete(`/portfolio/${itemId}`);
    set({
      profileUser: {
        ...get().profileUser,
        portfolio: get().profileUser.portfolio.filter((item) => item._id !== itemId),
      },
    });
  },
}));