import { useState } from "react";
import { supabase } from "../lib/supabase";
import { AiOutlineClose } from "react-icons/ai";

const EditProfile = ({ profile, onClose, onProfileUpdated }) => {
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("Username tidak boleh kosong!");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .update({ username, bio })
      .eq("user_id", profile.user_id)
      .select()
      .single();

    if (error) {
      // Username sudah dipakai orang lain
      if (error.message.includes("unique")) {
        setError("Username sudah dipakai!");
      } else {
        setError("Gagal update profile!");
      }
      setLoading(false);
      return;
    }

    onProfileUpdated(data); // kirim data baru ke Profile page
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Edit Profile</h2>
          <button onClick={onClose}>
            <AiOutlineClose className="text-xl text-slate-500 hover:text-slate-800" />
          </button>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block font-medium text-sm text-slate-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400 text-sm"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block font-medium text-sm text-slate-700 mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tulis bio kamu..."
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400 text-sm resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Tombol simpan */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;