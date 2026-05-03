import { useState } from "react";
import { supabase } from "../lib/supabase";
import { AiOutlineClose, AiOutlineCloudUpload } from "react-icons/ai";

const CreatePost = ({ onClose, onPostCreated, currentUser }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // Saat user pilih foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file)); // buat preview lokal
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);

    // 1. Upload foto ke Supabase Storage
    const fileExt = image.name.split(".").pop(); // ambil ekstensi file
    const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`; // nama unik

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, image);

    if (uploadError) {
      alert("Gagal upload foto!");
      setLoading(false);
      return;
    }

    // 2. Ambil public URL foto yang baru diupload
    const { data: urlData } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    // 3. Simpan post ke tabel posts
    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: currentUser.id,
        image_url: urlData.publicUrl,
        caption,
      })
      .select("*, profiles(username, avatar_url)")
      .single();

    console.log("post:", post);
    console.log("error:", error);

    setLoading(false);
    onPostCreated(post); // kirim post baru ke Home
    onClose(); // tutup modal
  };

  return (
    // Overlay gelap
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Buat Post</h2>
          <button onClick={onClose}>
            <AiOutlineClose className="text-xl text-slate-500 hover:text-slate-800" />
          </button>
        </div>

        {/* Upload foto */}
        {!preview ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl h-56 cursor-pointer hover:bg-slate-50 transition">
            <AiOutlineCloudUpload className="text-4xl text-slate-400 mb-2" />
            <span className="text-slate-400 text-sm">
              Klik untuk pilih foto
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        ) : (
          // Preview foto
          <div className="relative">
            <img
              src={preview}
              alt="preview"
              className="w-full h-56 object-cover rounded-xl"
            />
            <button
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
            >
              <AiOutlineClose className="text-sm" />
            </button>
          </div>
        )}

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Tulis caption..."
          rows={3}
          className="w-full mt-4 border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-400 resize-none"
        />

        {/* Tombol post */}
        <button
          onClick={handleSubmit}
          disabled={!image || loading}
          className="w-full mt-4 bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Mengupload..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
