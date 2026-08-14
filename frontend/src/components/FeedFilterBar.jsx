import { useState } from "react";
import { useGigStore } from "../store/gigStore";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "budgetHigh", label: "Budget: High to Low" },
  { value: "budgetLow", label: "Budget: Low to High" },
  { value: "fewestBids", label: "Fewest Bids" },
  { value: "mostBids", label: "Most Bids" },
];

export default function FeedFilterBar() {
  const { filters, setFilters, resetFilters } = useGigStore();
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ search: searchInput });
  };

  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-10">
      <div className="flex items-center gap-3 px-4 py-3 max-w-5xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search gigs..."
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 font-[Manrope] text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </form>

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ sort: e.target.value })}
          className="border border-[var(--color-border)] rounded-md px-2 py-2 font-[IBM_Plex_Mono] text-xs bg-transparent"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setPanelOpen((p) => !p)}
          className="border border-[var(--color-border)] rounded-md px-3 py-2 font-[IBM_Plex_Mono] text-xs uppercase tracking-wide hover:border-[var(--color-primary)]"
        >
          Filters {panelOpen ? "▲" : "▼"}
        </button>
      </div>

      {panelOpen && (
        <div className="max-w-5xl mx-auto px-4 pb-4 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
              Skills (comma separated)
            </label>
            <input
              type="text"
              defaultValue={filters.skills}
              onBlur={(e) => setFilters({ skills: e.target.value })}
              placeholder="React, Node.js"
              className="border border-[var(--color-border)] rounded-md px-2 py-1.5 text-sm bg-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
              Min Budget
            </label>
            <input
              type="number"
              defaultValue={filters.minBudget}
              onBlur={(e) => setFilters({ minBudget: e.target.value })}
              className="border border-[var(--color-border)] rounded-md px-2 py-1.5 text-sm w-28 bg-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
              Max Budget
            </label>
            <input
              type="number"
              defaultValue={filters.maxBudget}
              onBlur={(e) => setFilters({ maxBudget: e.target.value })}
              className="border border-[var(--color-border)] rounded-md px-2 py-1.5 text-sm w-28 bg-transparent"
            />
          </div>

          <button
            onClick={() => {
              setSearchInput("");
              resetFilters();
            }}
            className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-muted)] hover:text-[var(--color-primary)] underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}