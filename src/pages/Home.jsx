import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
  }, []);

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

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="flex">
      <Navbar onCreatePost={() => setShowCreatePost(true)} />
      <main className="ml-64 flex-1 min-h-screen bg-slate-100">
        <div className="max-w-lg mx-auto py-6 px-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Home</h2>

          {loading && (
            <div className="text-center text-slate-400 py-10">
              Loading posts...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              Belum ada post.
            </div>
          )}

          {!loading && posts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={currentUser} />
          ))}
        </div>
      </main>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Home;