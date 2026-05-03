import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";

const PostCard = ({ post, currentUser }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Ambil likes & cek apakah user sudah like
  useEffect(() => {
    const fetchLikes = async () => {
      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", post.id);

      setLikeCount(data?.length ?? 0);
      setLiked(data?.some((like) => like.user_id === currentUser?.id));
    };

    fetchLikes();
  }, [post.id]);

  // Ambil comments
  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select("*, profiles(username)")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      setComments(data ?? []);
    };

    fetchComments();
  }, [post.id]);

  // Toggle like
  const handleLike = async () => {
    if (liked) {
      // Unlike
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", currentUser.id);

      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      // Like
      await supabase
        .from("likes")
        .insert({ post_id: post.id, user_id: currentUser.id });

      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  // Kirim komentar
  const handleComment = async () => {
    if (!commentText.trim()) return;

    const { data } = await supabase
      .from("comments")
      .insert({
        post_id: post.id,
        user_id: currentUser.id,
        content: commentText,
      })
      .select("*, profiles(username)")
      .single();

    setComments((prev) => [...prev, data]);
    setCommentText("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4">
      {/* Header - avatar & username */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-bold text-slate-600">
          {post.profiles?.username?.[0].toUpperCase()}
        </div>
        <span className="font-medium text-slate-800">
          {post.profiles?.username}
        </span>
      </div>

      {/* Foto */}
      <img
        src={post.image_url}
        alt="post"
        className="w-full object-cover max-h-[500px]"
      />

      {/* Like & Comment buttons */}
      <div className="px-4 pt-3 flex items-center gap-4">
        <button onClick={handleLike} className="flex items-center gap-1">
          {liked ? (
            <AiFillHeart className="text-2xl text-red-500" />
          ) : (
            <AiOutlineHeart className="text-2xl text-slate-600" />
          )}
          <span className="text-sm text-slate-600">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1"
        >
          <AiOutlineComment className="text-2xl text-slate-600" />
          <span className="text-sm text-slate-600">{comments.length}</span>
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 py-2">
        <span className="font-medium text-slate-800 text-sm">
          {post.profiles?.username}
        </span>{" "}
        <span className="text-slate-600 text-sm">{post.caption}</span>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-3">
          {/* List komentar */}
          <div className="space-y-1 mb-2">
            {comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-medium text-slate-800">
                  {comment.profiles?.username}
                </span>{" "}
                <span className="text-slate-600">{comment.content}</span>
              </div>
            ))}
          </div>

          {/* Input komentar */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis komentar..."
              className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
            />
            <button
              onClick={handleComment}
              className="px-4 py-2 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 transition"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;