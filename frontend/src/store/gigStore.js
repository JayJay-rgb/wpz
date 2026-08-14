import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const defaultFilters = {
  search: "",
  skills: "",
  minBudget: "",
  maxBudget: "",
  sort: "newest",
};

export const useGigStore = create((set, get) => ({
  gigs: [],
  page: 1,
  totalPages: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  filters: { ...defaultFilters },

  selectedGig: null,
  selectedGigBids: null,
  detailLoading: false,

  myGigs: [],
  myGigsLoading: false,

  setFilters: (partial) => {
    set({ filters: { ...get().filters, ...partial } });
    get().fetchGigs(true);
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
    get().fetchGigs(true);
  },

  fetchGigs: async (reset = false) => {
    const { filters, page, gigs } = get();
    const targetPage = reset ? 1 : page;

    set(reset ? { loading: true, hasMore: true } : { loadingMore: true });

    try {
      const params = { ...filters, page: targetPage, limit: 10 };
      Object.keys(params).forEach((k) => {
        if (params[k] === "" || params[k] == null) delete params[k];
      });

      const res = await axiosInstance.get("/gigs", { params });
      const { gigs: newGigs, totalPages, currentPage } = res.data;

      set({
        gigs: reset ? newGigs : [...gigs, ...newGigs],
        page: currentPage + 1,
        totalPages,
        hasMore: currentPage < totalPages,
        loading: false,
        loadingMore: false,
      });
    } catch (err) {
      console.log(err);
      set({ loading: false, loadingMore: false, hasMore: false });
    }
  },

  fetchGigDetail: async (id) => {
    set({ detailLoading: true, selectedGig: null, selectedGigBids: null });
    try {
      const res = await axiosInstance.get(`/gigs/${id}`);
      set({
        selectedGig: res.data.gig,
        selectedGigBids: res.data.bids,
        detailLoading: false,
      });
    } catch (err) {
      console.log(err);
      set({ detailLoading: false });
    }
  },

  clearSelectedGig: () => set({ selectedGig: null, selectedGigBids: null }),

  fetchMyGigs: async () => {
    set({ myGigsLoading: true });
    try {
      const res = await axiosInstance.get("/mygigs");
      set({ myGigs: res.data.gigs || [], myGigsLoading: false });
    } catch (err) {
      console.log(err);
      set({ myGigsLoading: false });
    }
  },

  cancelGig: async (id) => {
    const res = await axiosInstance.patch(`/gigs/${id}/cancel`);
    set({
      myGigs: get().myGigs.map((g) => (g._id === id ? res.data.gig : g)),
    });
  },

  completeGig: async (id) => {
    const res = await axiosInstance.patch(`/gigs/${id}/complete`);
    set({
      myGigs: get().myGigs.map((g) => (g._id === id ? res.data.gig : g)),
    });
  },

  acceptBid: async (gigId, bidId) => {
    const res = await axiosInstance.patch(`/gigs/${gigId}/accept-bid`, { bidId });
    set({ selectedGig: res.data.gig });
    return res.data;
  },
}));