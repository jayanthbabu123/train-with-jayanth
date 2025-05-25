import React, { useRef, useEffect, useState } from 'react';
import { Typography, Spin, Button, Tooltip, Divider } from 'antd';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { db } from '../services/firebase';
import { collection, doc, getCountFromServer, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

// Utility to extract code string from children (handles nested React elements)
function extractCodeString(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractCodeString).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return extractCodeString(children.props.children);
  }
  return '';
}

function LikeButton({ postId }) {
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId || !currentUser) return;
    let unsub = false;
    const fetchLikes = async () => {
      // Check if user liked
      const likeDoc = await getDoc(doc(db, 'feeds', postId, 'likes', currentUser.uid));
      if (!unsub) setLiked(likeDoc.exists());
      // Get like count
      const likesCol = collection(db, 'feeds', postId, 'likes');
      const snap = await getCountFromServer(likesCol);
      if (!unsub) setLikeCount(snap.data().count || 0);
    };
    fetchLikes();
    return () => { unsub = true; };
  }, [postId, currentUser]);

  const handleLike = async () => {
    if (!currentUser || liked) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'feeds', postId, 'likes', currentUser.uid), {
        userId: currentUser.uid,
        likedAt: new Date(),
      });
      setLiked(true);
      setLikeCount((c) => c + 1);
    } catch (e) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={liked ? 'You liked this' : 'Like'}>
      <Button
        type="text"
        icon={liked ? <LikeFilled style={{ color: '#1677ff', fontSize: 22 }} /> : <LikeOutlined style={{ color: '#1677ff', fontSize: 22 }} />}
        onClick={handleLike}
        disabled={liked || loading}
        style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, paddingLeft: 0 }}
      >
        <span style={{ color: '#1677ff', fontWeight: 600, fontSize: 16 }}>Like</span>
        <span style={{ color: '#1677ff', fontWeight: 600, fontSize: 16 }}>{likeCount}</span>
      </Button>
    </Tooltip>
  );
}

export default function FeedList({ feeds, loading, onLoadMore, hasMore }) {
  const listRef = useRef();

  // Infinite scroll: call onLoadMore when near bottom
  useEffect(() => {
    if (!hasMore || loading) return;
    const handleScroll = () => {
      const el = listRef.current;
      if (!el) return;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
        onLoadMore && onLoadMore();
      }
    };
    const el = listRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading, onLoadMore]);

  // Custom code block renderer for dark theme
  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = extractCodeString(children);
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            borderRadius: 12,
            margin: '20px 0',
            fontSize: 16,
            background: 'rgba(24,24,28,0.95)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          }}
          {...props}
        >
          {codeString.replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} style={{ background: '#f5f5f5', borderRadius: 6, padding: '2px 8px', fontSize: 15 }}>
          {codeString}
        </code>
      );
    }
  };

  return (
    <div
      ref={listRef}
      style={{
        maxHeight: 600,
        overflowY: 'auto',
        background: 'transparent',
        borderRadius: 18,
        padding: 0,
        margin: 0,
      }}
    >
      {feeds.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Text type="secondary">No posts yet.</Text>
        </div>
      )}
      {feeds.map((post, idx) => (
        <div
          key={post.id || idx}
          style={{
            margin: '0 0 48px 0',
            background: 'rgba(255,255,255,0.65)',
            borderRadius: 24,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            padding: 0,
            position: 'relative',
            border: '1.5px solid rgba(230,234,241,0.7)',
            transition: 'box-shadow 0.2s, transform 0.2s',
            minHeight: 140,
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontFamily: 'Inter, system-ui, sans-serif',
            cursor: 'pointer',
            willChange: 'transform',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31,38,135,0.22)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}
        >
          {/* Gradient bar for separation */}
          <div style={{ height: 7, background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24 }} />
          <div style={{ padding: '36px 36px 0 36px' }}>
            {post.title && <Title level={3} style={{ margin: 0, marginBottom: 8, fontWeight: 800, color: '#222', letterSpacing: 0.2 }}>{post.title}</Title>}
            {post.imageUrl && <img src={post.imageUrl} alt="Feed" style={{ maxWidth: '100%', borderRadius: 14, margin: '18px 0', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />}
            {post.link && <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1677ff', display: 'block', marginBottom: 16, fontWeight: 600, fontSize: 16 }}>{post.link}</a>}
            <div data-color-mode="light">
              <MarkdownPreview source={post.content} style={{ background: 'none', fontSize: 17, fontFamily: 'Inter, system-ui, sans-serif' }} components={markdownComponents} />
            </div>
          </div>
          <Divider style={{ margin: '28px 0 0 0', borderColor: 'rgba(200,200,200,0.25)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px 24px 36px', minHeight: 48 }}>
            <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>
              {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : new Date(post.createdAt).toLocaleString()}
            </Text>
            <LikeButton postId={post.id} />
          </div>
        </div>
      ))}
      {loading && (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      )}
      {!loading && hasMore && (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <Button onClick={onLoadMore}>Load More</Button>
        </div>
      )}
    </div>
  );
} 