import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Row, 
  Col, 
  Typography, 
  Select, 
  Space, 
  Tag,
  Spin,
  Empty,
  Button,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  PlayCircleOutlined, 
  ClockCircleOutlined,
  CalendarOutlined,
  FilterOutlined,
  UserOutlined
} from '@ant-design/icons';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;

export default function StudentVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { currentUser } = useAuth();

  // Get unique categories from videos
  const [categories, setCategories] = useState([]);

  // Duration options
  const durationOptions = [
    { label: 'All Durations', value: 'all' },
    { label: 'Under 10 min', value: 'short' },
    { label: '10-30 min', value: 'medium' },
    { label: 'Over 30 min', value: 'long' }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      console.log('Fetching all videos...');
      
      // Get all videos
      const videosRef = collection(db, 'videos');
      const videosSnapshot = await getDocs(videosRef);
      const allVideos = videosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort videos by upload date in descending order (newest first)
      const sortedVideos = allVideos.sort((a, b) => {
        if (!a.uploadDate || !b.uploadDate) return 0;
        return a.uploadDate.toDate() - b.uploadDate.toDate();
      });

      // Extract unique categories
      const uniqueCategories = [...new Set(sortedVideos.map(video => video.category))].filter(Boolean);
      setCategories(uniqueCategories);
      
      console.log('Fetched videos:', sortedVideos);
      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesDuration = selectedDuration === 'all' || video.duration === selectedDuration;
    
    return matchesSearch && matchesCategory && matchesDuration;
  });

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Video Library</Title>
        <Text type="secondary">Access all your course videos in one place</Text>
      </div>

      {/* Search and Filter Section */}
      <Card 
        style={{ marginBottom: '24px', borderRadius: '12px' }}
        bodyStyle={{ padding: '16px' }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search videos..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Filter by category"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
            >
              <Option value="all">All Categories</Option>
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Filter by duration"
              style={{ width: '100%' }}
              value={selectedDuration}
              onChange={setSelectedDuration}
              size="large"
            >
              {durationOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filteredVideos.map(video => (
            <Col xs={24} sm={12} md={8} lg={6} key={video.id}>
              <Card
                hoverable
                onClick={() => handleVideoClick(video)}
                cover={
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <img
                      alt={video.title}
                      src={video.thumbnail}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '50%',
                        padding: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <PlayCircleOutlined style={{ fontSize: '32px', color: '#fff' }} />
                    </div>
                  </div>
                }
                style={{ borderRadius: '12px', overflow: 'hidden' }}
              >
                <Meta
                  title={video.title}
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text type="secondary" ellipsis={{ rows: 2 }}>
                        {video.description}
                      </Text>
                      <Space size="middle">
                        <Tag icon={<ClockCircleOutlined />} color="blue">
                          {formatDuration(video.duration)}
                        </Tag>
                        <Tag icon={<CalendarOutlined />} color="green">
                          {formatDate(video.uploadDate)}
                        </Tag>
                      </Space>
                      <div style={{ marginTop: '8px' }}>
                        <Tag icon={<UserOutlined />} color="purple">
                          {video.uploadedByName}
                        </Tag>
                      </div>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description={
            <Space direction="vertical" size="large">
              <Text>No videos found</Text>
              <Button 
                type="primary" 
                icon={<FilterOutlined />}
                onClick={() => {
                  setSearchText('');
                  setSelectedCategory('all');
                  setSelectedDuration('all');
                }}
              >
                Clear Filters
              </Button>
            </Space>
          }
          style={{ margin: '48px 0' }}
        />
      )}

      {/* Video Modal */}
      <Modal
        title={selectedVideo?.title}
        open={!!selectedVideo}
        onCancel={handleCloseModal}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px' }}
      >
        {selectedVideo && (
          <div style={{ width: '100%', aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src={selectedVideo.embedUrl}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </div>
  );
} 