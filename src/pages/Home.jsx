import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
  }, []);

  // Ambil semua post
  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, profiles(username, avatar_url)")
        .order("created_at", { ascending: false });

      setPosts(data ?? []);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex">
      <Navbar />
      <main className="ml-64 flex-1 min-h-screen bg-slate-100">
        <div className="max-w-lg mx-auto py-6 px-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Home</h2>

          {/* Loading */}
          {loading && (
            <div className="text-center text-slate-400 py-10">
              Loading posts...
            </div>
          )}

          {/* Tidak ada post */}
          {!loading && posts.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              Belum ada post.
            </div>
          )}

          {/* List post */}
          {!loading && posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;