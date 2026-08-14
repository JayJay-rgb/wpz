import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function CreateGig() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    let budget = undefined;
    if (minBudget || maxBudget) {
      const min = Number(minBudget);
      const max = Number(maxBudget);
      if (!minBudget || !maxBudget) {
        setError("Enter both a minimum and maximum budget, or leave both blank.");
        return;
      }
      if (min > max) {
        setError("Minimum budget cannot exceed maximum budget.");
        return;
      }
      budget = { min, max };
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/gigs", { title, description, budget, skills });
      navigate(`/gigs/${res.data.gig._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-[Fraunces] text-2xl mb-6">Post a Gig</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build a landing page for my startup"
            className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Describe the work, deliverables, and any specifics a freelancer should know..."
            className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)] resize-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
              Min Budget ($)
            </label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="100"
              className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
              Max Budget ($)
            </label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="500"
              className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
            Skills
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter"
              className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
            />
            <button
              onClick={addSkill}
              type="button"
              className="border border-[var(--color-border)] rounded-md px-4 text-sm hover:border-[var(--color-primary)]"
            >
              Add
            </button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wide border border-[var(--color-border)] rounded-full pl-2 pr-1 py-0.5 flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-[var(--color-primary)]"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="font-[Manrope] text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[var(--color-primary)] text-white font-[IBM_Plex_Mono] text-sm uppercase tracking-wide rounded-md py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Gig"}
        </button>
      </form>
    </div>
  );
}