import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs, orderBy, query, startAfter, limit } from 'firebase/firestore';
import {
  Card,
  Button,
  Input,
  Typography,
  Row,
  Col,
  Form,
  message,
  Space,
  Divider,
  List,
} from 'antd';
import { PlusOutlined, LinkOutlined, PictureOutlined } from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import MarkdownPreview from '@uiw/react-markdown-preview';
import FeedList from '../../components/FeedList';

const { Title, Text } = Typography;

export default function TrainerFeed() {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const fetchPosts = async (reset = false) => {
    setLoadingPosts(true);
    try {
      let q = query(collection(db, 'feeds'), orderBy('createdAt', 'desc'), limit(10));
      if (!reset && lastDoc) {
        q = query(collection(db, 'feeds'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(10));
      }
      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 10);
    } catch (error) {
      message.error('Failed to load feed posts');
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingPosts && hasMore) {
      fetchPosts(false);
    }
  };

  const handleSubmit = async () => {
    if (!content && !imageUrl && !link) {
      message.warning('Please enter some content, image, or link.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feeds'), {
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        link: link.trim(),
        createdAt: new Date(),
      });
      message.success('Feed post shared!');
      setTitle('');
      setContent('');
      setImageUrl('');
      setLink('');
      form.resetFields();
      fetchPosts();
    } catch (error) {
      message.error('Failed to share post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 0 }}>Trainer Feed</Title>
        <Text type="secondary">Share important updates, interview questions, images, code, or links with your students. Preview your post before sharing.</Text>
        <Divider />
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <Form.Item label="Title (optional)" name="title">
                <Input
                  placeholder="Enter a title for your post"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={100}
                />
              </Form.Item>
              <Form.Item label="Markdown Content" name="content">
                <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={setContent}
                    height={220}
                    preview="edit"
                    previewOptions={{
                      components: {
                        img: ({ src, alt }) => <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 8, margin: '12px 0' }} />,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#1677ff' }}>{children}</a>
                      }
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item label="Image URL (optional)" name="imageUrl">
                <Input
                  prefix={<PictureOutlined />}
                  placeholder="Paste an image URL to display"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Link (optional)" name="link">
                <Input
                  prefix={<LinkOutlined />}
                  placeholder="Paste a link (e.g. resource, video, etc.)"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  htmlType="submit"
                  loading={submitting}
                  block
                  size="large"
                >
                  Share Post
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ background: '#fafbfc', borderRadius: 8, padding: 16, minHeight: 350, border: '1px solid #f0f0f0' }}>
              <Text strong style={{ fontSize: 16 }}>Live Preview</Text>
              <Divider style={{ margin: '8px 0' }} />
              {title && <Title level={4} style={{ marginTop: 0 }}>{title}</Title>}
              {imageUrl && <img src={imageUrl} alt="Feed" style={{ maxWidth: '100%', borderRadius: 8, margin: '12px 0' }} />}
              {link && <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#1677ff', display: 'block', marginBottom: 12 }}>{link}</a>}
              <div data-color-mode="light">
                <MarkdownPreview source={content} style={{ background: 'none' }} />
              </div>
              {(!title && !content && !imageUrl && !link) && <Text type="secondary">Nothing to preview yet.</Text>}
            </div>
          </Col>
        </Row>
      </Card>

      <Title level={3} style={{ marginBottom: 16 }}>Your Previous Posts</Title>
      <FeedList
        feeds={posts}
        loading={loadingPosts}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
} 