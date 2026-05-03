import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import EditProfile from "../components/EditProfile";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id)
        .single();

      setProfile(profileData);

      const { data: postsData } = await supabase
        .from("posts")
        .select("*, profiles(username, avatar_url)")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      setPosts(postsData ?? []);

      const { count: followers } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", id);

      const { count: following } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", id);

      setFollowerCount(followers ?? 0);
      setFollowingCount(following ?? 0);
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (!currentUser || !id) return;

    const checkFollow = async () => {
      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", currentUser.id)
        .eq("following_id", id)
        .single();

      setIsFollowing(!!data);
    };

    checkFollow();
  }, [currentUser, id]);

  const isOwnProfile = currentUser?.id === id;

  const handleFollow = async () => {
    setFollowLoading(true);

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUser.id)
        .eq("following_id", id);

      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: currentUser.id, following_id: id });

      await supabase.from("notifications").insert({
        receiver_id: id,
        sender_id: currentUser.id,
        type: "follow",
        post_id: null,
      });

      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }

    setFollowLoading(false);
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className="flex">
      <Navbar onCreatePost={() => setShowCreatePost(true)} />
      <main className="ml-64 flex-1 min-h-screen bg-slate-100">
        <div className="max-w-lg mx-auto py-6 px-4">
          {profile && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center text-2xl font-bold text-slate-600">
                  {profile.username?.[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {profile.username}
                  </h2>
                  {profile.bio && (
                    <p className="text-slate-600 text-sm mt-1">{profile.bio}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-around gap-4 mt-3">
                <div className="text-center">
                  <p className="font-bold text-slate-800">{posts.length}</p>
                  <p className="text-xs text-slate-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800">{followerCount}</p>
                  <p className="text-xs text-slate-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800">{followingCount}</p>
                  <p className="text-xs text-slate-500">Following</p>
                </div>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="mt-4 w-full border border-slate-300 text-slate-700 font-medium py-2 rounded-xl hover:bg-slate-50 transition text-sm"
                >
                  Edit Profile
                </button>
              )}

              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`mt-4 w-full font-medium py-2 rounded-xl transition text-sm disabled:opacity-50
                    ${
                      isFollowing
                        ? "border border-slate-300 text-slate-700 hover:bg-slate-50"
                        : "bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                >
                  {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="text-center text-slate-400 py-10">Loading...</div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              Belum ada post.
            </div>
          )}

          {!loading &&
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onDelete={handleDeletePost}
              />
            ))}
        </div>
      </main>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])}
          currentUser={currentUser}
        />
      )}

      {showEditProfile && (
        <EditProfile
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)}
        />
      )}
    </div>
  );
};

export default Profile;
