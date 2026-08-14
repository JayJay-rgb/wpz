import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfileStore } from "../store/profileStore";
import { useAuthStore } from "../store/authStore";
import axiosInstance from "../api/axiosInstance";

function PortfolioForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [link, setLink] = useState(initial?.link || "");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("link", link.trim());
    if (file) formData.append("image", file);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg w-full max-w-md p-6 flex flex-col gap-4"
      >
        <h2 className="font-[Fraunces] text-xl">
          {initial ? "Edit Portfolio Item" : "Add Portfolio Item"}
        </h2>

        <div className="flex flex-col gap-1">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)] resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">
            Image {initial && "(leave blank to keep current)"}
          </label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        </div>

        {error && <p className="font-[Manrope] text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-[var(--color-border)] rounded-md py-2 text-sm hover:border-[var(--color-primary)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-[var(--color-primary)] text-white rounded-md py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function UserProfile() {
  const { userId } = useParams();
  const { profileUser, profileLoading, fetchProfile, addPortfolioItem, editPortfolioItem, deletePortfolioItem } =
    useProfileStore();
  const { user: loggedInUser, setAuth, accessToken } = useAuthStore();

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const isOwnProfile = loggedInUser?._id === userId;

  useEffect(() => {
    fetchProfile(userId);
  }, [userId]);

  useEffect(() => {
    if (profileUser) {
      setBioDraft(profileUser.bio || "");
      setNameDraft(profileUser.name || "");
    }
  }, [profileUser]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await axiosInstance.patch("/profile", { name: nameDraft, bio: bioDraft });
      setAuth(res.data.user, accessToken);
      fetchProfile(userId);
      setEditingBio(false);
    } catch (err) {
      console.log(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddItem = async (formData) => {
    await addPortfolioItem(formData);
    setFormOpen(false);
  };

  const handleEditItem = async (formData) => {
    await editPortfolioItem(editingItem._id, formData);
    setEditingItem(null);
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Delete this portfolio item?")) return;
    try {
      await deletePortfolioItem(itemId);
    } catch (err) {
      console.log(err);
    }
  };

  if (profileLoading || !profileUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="h-40 rounded-lg border border-[var(--color-border)] animate-pulse bg-[var(--color-surface)]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="border border-[var(--color-border)] rounded-lg p-6 bg-[var(--color-surface)] mb-8">
        {!editingBio ? (
          <>
            <div className="flex justify-between items-start mb-3">
              <h1 className="font-[Fraunces] text-2xl">{profileUser.name || "Unnamed user"}</h1>
              {isOwnProfile && (
                <button
                  onClick={() => setEditingBio(true)}
                  className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-primary)] hover:opacity-80"
                >
                  Edit
                </button>
              )}
            </div>
            <p className="font-[Manrope] text-sm text-[var(--color-muted)] whitespace-pre-wrap">
              {profileUser.bio || (isOwnProfile ? "Add a bio to tell people what you do." : "No bio yet.")}
            </p>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">Name</label>
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)]">Bio</label>
              <textarea
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                rows={4}
                className="border border-[var(--color-border)] rounded-md px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-[var(--color-primary)] resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingBio(false)}
                className="flex-1 border border-[var(--color-border)] rounded-md py-2 text-sm hover:border-[var(--color-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="flex-1 bg-[var(--color-primary)] text-white rounded-md py-2 text-sm hover:opacity-90 disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-[Fraunces] text-lg">Portfolio</h2>
        {isOwnProfile && (profileUser.portfolio?.length || 0) < 12 && (
          <button
            onClick={() => setFormOpen(true)}
            className="font-[IBM_Plex_Mono] text-xs uppercase text-[var(--color-primary)] hover:opacity-80"
          >
            + Add item
          </button>
        )}
      </div>

      {(!profileUser.portfolio || profileUser.portfolio.length === 0) && (
        <p className="font-[Manrope] text-sm text-[var(--color-muted)]">
          {isOwnProfile ? "No portfolio items yet — add your first one." : "No portfolio items yet."}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profileUser.portfolio?.map((item) => (
          <div key={item._id} className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-surface)]">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-[Fraunces] text-base mb-1">{item.title}</h3>
              {item.description && (
                <p className="font-[Manrope] text-sm text-[var(--color-muted)] mb-2">{item.description}</p>
              )}
              {item.link && (
                
                 <a href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-[IBM_Plex_Mono] text-xs text-[var(--color-primary)] hover:underline"
                >
                  View →
                </a>
              )}

              {isOwnProfile && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="font-[IBM_Plex_Mono] text-[10px] uppercase text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="font-[IBM_Plex_Mono] text-[10px] uppercase text-red-500 hover:opacity-80"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {formOpen && <PortfolioForm onSubmit={handleAddItem} onCancel={() => setFormOpen(false)} />}
      {editingItem && (
        <PortfolioForm initial={editingItem} onSubmit={handleEditItem} onCancel={() => setEditingItem(null)} />
      )}
    </div>
  );
}