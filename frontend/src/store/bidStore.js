import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

export const useBidStore = create((set) => ({
  myBids: [],
  myBidsLoading: false,

  fetchMyBids: async () => {
    set({ myBidsLoading: true });
    try {
      const res = await axiosInstance.get("/bids/mine");
      set({ myBids: res.data.bids || [], myBidsLoading: false });
    } catch (err) {
      console.log(err);
      set({ myBidsLoading: false });
    }
  },
}));