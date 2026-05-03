import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*, profiles!notifications_sender_fkey(username)")
        .eq("receiver_id", currentUser.id)
        .order("created_at", { ascending: false });

      setNotifications(data ?? []);
      setLoading(false);

      // Mark semua notifikasi sebagai sudah dibaca
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("receiver_id", currentUser.id)
        .eq("read", false);
    };

    fetchNotifications();
  }, [currentUser]);

  const getNotifText = (notif) => {
    const username = notif.profiles?.username;
    if (notif.type === "like") return `${username} menyukai postmu`;
    if (notif.type === "comment") return `${username} mengomentari postmu`;
    if (notif.type === "follow") return `${username} mulai mengikutimu`;
    return "";
  };

  const handleNotifClick = (notif) => {
    if (notif.type === "follow") {
      navigate(`/profile/${notif.sender_id}`);
    } else {
      navigate(`/profile/${notif.sender_id}`);
    }
  };

  return (
    <div className="flex">
      <Navbar onCreatePost={() => setShowCreatePost(true)} />
      <main className="ml-64 flex-1 min-h-screen bg-slate-100">
        <div className="max-w-lg mx-auto py-6 px-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Notifications
          </h2>

          {loading && (
            <div className="text-center text-slate-400 py-10">Loading...</div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              Belum ada notifikasi.
            </div>
          )}

          {!loading && notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3 mb-2 border cursor-pointer hover:bg-slate-50 transition
                ${!notif.read ? "border-slate-400" : "border-slate-200"}`}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                {notif.profiles?.username?.[0].toUpperCase()}
              </div>

              {/* Teks */}
              <div className="flex-1">
                <p className="text-sm text-slate-700">{getNotifText(notif)}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(notif.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Dot unread */}
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-slate-800 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </main>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {}}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Notifications;