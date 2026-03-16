import { useEffect, useState, type CSSProperties } from 'react';
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreVertical,
  Pencil,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLike } from '../../hooks/useLike';
import CommentSection from './CommentSection';
import { postsApi } from '../../api/posts';
import { getApiErrorMessage } from '../../api/errors';
import { useAuthStore } from '../../store/authStore';
import type { Post } from '../../types/post';
import { getDefaultAvatar } from '../../lib/utils';
import toast from 'react-hot-toast';

const POST_TYPE_MAP: Record<string, { label: string; icon: string; color: string }> = {
  daily_win: { label: 'Daily Win', icon: '🏆', color: '#f59e0b' },
  milestone: { label: 'Milestone', icon: '🎯', color: '#6366f1' },
  reflection: { label: 'Reflection', icon: '💭', color: '#64748b' },
  challenge: { label: 'Challenge', icon: '⚡', color: '#FF5C00' },
  goal_update: { label: 'Goal Update', icon: '📈', color: '#10b981' },
  photo_progress: { label: 'Photo Progress', icon: '📸', color: '#ec4899' },
};

function linkHashtags(text: string) {
  return text.replace(
    /#(\w+)/g,
    `<span style="color:var(--color-accent);font-weight:600;cursor:pointer">#$1</span>`
  );
}

function invalidatePostQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['feed'] });
  queryClient.invalidateQueries({ queryKey: ['user-posts'] });
  queryClient.invalidateQueries({ queryKey: ['explore-recent'] });
  queryClient.invalidateQueries({ queryKey: ['search'] });
}

function EditPostSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(post.content);
  const [postType, setPostType] = useState(post.postType);
  const maxLength = 500;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const { mutate: updatePost, isPending } = useMutation({
    mutationFn: () => postsApi.update(post.id, { content: content.trim(), postType }),
    onSuccess: () => {
      invalidatePostQueries(queryClient);
      toast.success('Post updated');
      onClose();
    },
    onError: error =>
      toast.error(
        getApiErrorMessage(error, {
          fallback: 'Could not update post.',
          action: 'update your post',
        })
      ),
  });

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md animate-scale-in overflow-hidden"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            maxHeight: '82vh',
          }}
        >
          <div
            className="flex items-center justify-between px-5 pt-5 pb-4"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div>
              <h3
                className="text-base font-bold"
                style={{ fontFamily: "'Syne', sans-serif", color: 'var(--color-text)' }}
              >
                Edit Post
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Update your progress and keep the momentum going.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--color-hover)';
                e.currentTarget.style.color = 'var(--color-text)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex max-h-[calc(82vh-73px)] flex-col overflow-hidden">
            <div className="space-y-4 overflow-y-auto px-5 py-4">
              <div
                className="rounded-2xl p-3.5"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <img
                    src={post.author.avatarUrl || getDefaultAvatar(post.author.username)}
                    className="h-9 w-9 rounded-full object-cover"
                    alt={post.author.displayName}
                    onError={event => {
                      event.currentTarget.src = getDefaultAvatar(post.author.username);
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      {post.author.displayName}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      @{post.author.username}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(POST_TYPE_MAP).map(([value, type]) => (
                    <button
                      key={value}
                      onClick={() => setPostType(value)}
                      className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{
                        background: postType === value ? `${type.color}18` : 'transparent',
                        color: postType === value ? type.color : 'var(--color-text-muted)',
                        border: `1px solid ${postType === value ? type.color : 'var(--color-border)'}`,
                      }}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  value={content}
                  onChange={event => setContent(event.target.value)}
                  maxLength={maxLength}
                  rows={6}
                  autoFocus
                  className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    caretColor: 'var(--color-accent)',
                  }}
                  onFocus={event => {
                    event.target.style.borderColor = 'var(--color-accent)';
                  }}
                  onBlur={event => {
                    event.target.style.borderColor = 'var(--color-border)';
                  }}
                />
                <div className="mt-1.5 text-right text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {maxLength - content.length}
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-end gap-3 px-5 py-4"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm"
                style={{ background: 'var(--color-hover)', color: 'var(--color-text-muted)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => content.trim() && updatePost()}
                disabled={!content.trim() || isPending}
                className="rounded-xl px-5 py-2 text-sm font-semibold transition-opacity disabled:opacity-40"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
              >
                {isPending ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function OwnerMenu({
  onEdit,
  onDelete,
  isDeleting,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(value => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-full transition-colors"
        style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'var(--color-text)';
          e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--color-text-muted)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-12 z-20 w-36 overflow-hidden rounded-2xl py-1 shadow-xl"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--color-text)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--color-hover)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => {
                setOpen(false);
                if (window.confirm('Delete this post?')) onDelete();
              }}
              disabled={isDeleting}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors disabled:opacity-50"
              style={{ color: '#ef4444' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ActionButton({
  active = false,
  activeColor,
  children,
  onClick,
}: {
  active?: boolean;
  activeColor?: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all"
      style={{
        color: active ? activeColor ?? 'var(--color-accent)' : 'var(--color-text-muted)',
        background: active ? `${activeColor ?? 'var(--color-accent)'}14` : 'transparent',
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = 'var(--color-hover)';
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

export default function PostCard({ post }: { post: Post }) {
  const { mutate: toggleLike } = useLike();
  const authUser = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const [showComments, setShowComments] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likePopping, setLikePopping] = useState(false);

  const author = post.author;
  const likes = post._count?.likes ?? 0;
  const comments = post._count?.comments ?? 0;
  const time = formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });
  const isOwnPost = authUser?.id === author.id;
  const typeMeta = POST_TYPE_MAP[post.postType] ?? POST_TYPE_MAP.daily_win;

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: () => postsApi.remove(post.id),
    onSuccess: () => {
      invalidatePostQueries(queryClient);
      toast.success('Post deleted');
    },
    onError: error =>
      toast.error(
        getApiErrorMessage(error, {
          fallback: 'Could not delete post.',
          action: 'delete your post',
        })
      ),
  });

  const handleLike = () => {
    setLikePopping(true);
    window.setTimeout(() => setLikePopping(false), 320);
    toggleLike({ postId: post.id, liked: post.liked ?? false });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Check this out on 1% Better', url });
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    } catch {
      toast.error('Could not share this post.');
    }
  };

  return (
    <>
      <article
        className="mb-6 overflow-hidden rounded-[2rem]"
        style={{
          background: 'rgba(255, 252, 248, 0.96)',
          border: '1px solid rgba(245, 158, 11, 0.14)',
          boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)',
        } as CSSProperties}
      >
        <div className="flex items-start gap-3 px-6 pt-6 pb-4">
          <Link to={`/profile/${author.username}`} className="shrink-0">
            <img
              src={author.avatarUrl || getDefaultAvatar(author.username)}
              className="h-14 w-14 rounded-full object-cover"
              style={{ border: '4px solid rgba(125, 211, 252, 0.45)' } as CSSProperties}
              alt={author.displayName}
              onError={event => {
                event.currentTarget.src = getDefaultAvatar(author.username);
              }}
            />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${author.username}`}
                className="truncate text-[1.7rem] font-bold leading-none transition-opacity hover:opacity-75"
                style={{ fontFamily: "'Syne', sans-serif", color: 'var(--color-text)' }}
              >
                {author.displayName}
              </Link>
              <span className="truncate text-lg" style={{ color: 'var(--color-text-muted)' }}>
                @{author.username}
              </span>
            </div>
            <p className="mt-2 text-[1.05rem]" style={{ color: 'var(--color-text-muted)' }}>
              Posted {time}
            </p>
          </div>

          {isOwnPost ? (
            <OwnerMenu
              onEdit={() => setShowEditSheet(true)}
              onDelete={() => deletePost()}
              isDeleting={isDeleting}
            />
          ) : (
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <MoreVertical size={18} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 px-6 pb-4">
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold"
            style={{
              background: `${typeMeta.color}18`,
              color: typeMeta.color,
              border: `1px solid ${typeMeta.color}25`,
            }}
          >
            {typeMeta.icon} {typeMeta.label}
          </span>

          {post.hashtags?.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.72)',
                color: 'var(--color-accent)',
                border: '1px solid rgba(255, 92, 0, 0.14)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="px-6 pb-7">
          <p
            className="text-[1.15rem] leading-[1.8]"
            style={{ color: 'var(--color-text)' }}
            dangerouslySetInnerHTML={{ __html: linkHashtags(post.content) }}
          />
        </div>

        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="px-6 pb-6">
            <div
              className="overflow-hidden rounded-[1.6rem]"
              style={{
                display: 'grid',
                gridTemplateColumns: post.mediaUrls.length === 1 ? '1fr' : '1fr 1fr',
                gap: '2px',
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(15, 23, 42, 0.06)',
              }}
            >
              {post.mediaUrls.slice(0, 4).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  className="w-full object-cover"
                  style={{ height: post.mediaUrls!.length === 1 ? '340px' : '200px' }}
                  alt=""
                />
              ))}
            </div>
          </div>
        )}

        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}
        >
          <div className="flex items-center gap-1">
            <ActionButton onClick={handleLike} active={Boolean(post.liked)} activeColor="#ec4899">
              <Heart
                size={20}
                fill={post.liked ? 'currentColor' : 'none'}
                style={{
                  transform: likePopping ? 'scale(1.35)' : 'scale(1)',
                  transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1)',
                }}
              />
              {likes > 0 ? <span>{likes}</span> : null}
            </ActionButton>

            <ActionButton
              onClick={() => setShowComments(value => !value)}
              active={showComments}
              activeColor="#60a5fa"
            >
              <MessageCircle size={20} />
              {comments > 0 ? <span>{comments}</span> : null}
            </ActionButton>

            <ActionButton onClick={handleShare}>
              <Share2 size={20} />
            </ActionButton>
          </div>

          <ActionButton onClick={() => setBookmarked(value => !value)} active={bookmarked} activeColor="#f59e0b">
            <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
            <span>{bookmarked ? 'Saved' : 'Save'}</span>
          </ActionButton>
        </div>
      </article>

      {showComments && <CommentSection postId={post.id} post={post} onClose={() => setShowComments(false)} />}
      {showEditSheet && <EditPostSheet post={post} onClose={() => setShowEditSheet(false)} />}
    </>
  );
}
