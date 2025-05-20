import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Card, 
  Row, 
  Col, 
  message, 
  Tabs,
  Table,
  Space,
  Modal,
  Tag,
  Typography,
  Popconfirm,
  Tooltip,
  List,
  Switch
} from "antd";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

function getYoutubeEmbedUrl(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
}

function getYoutubeThumbnail(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : "";
}

const LANGUAGES = ["JavaScript", "HTML", "CSS", "Bootstrap", "React", "Node.js", "Express", "MongoDB", "Github"];

export default function TrainerVideoUpload() {
  const [form] = Form.useForm();
  const [embedUrl, setEmbedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      console.log('Fetching all videos...');
      
      // Get all videos
      const videosRef = collection(db, 'videos');
      const q = query(
        videosRef,
        orderBy('uploadDate', 'desc')
      );
      
      const videosSnapshot = await getDocs(q);
      const videosList = videosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Fetched videos:', videosList);
      setVideos(videosList);
    } catch (error) {
      console.error("Error fetching videos:", error);
      message.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEdit = (video) => {
    setIsEditMode(true);
    form.setFieldsValue({
      id: video.id,
      title: video.title,
      description: video.description,
      link: video.youtubeUrl,
      language: video.category,
      batch: video.batchId
    });
    setEmbedUrl(video.embedUrl);
    setActiveTab('upload');
  };

  const handleVideoSubmit = async (values) => {
    try {
      setLoading(true);
      
      const youtubeVideoId = values.link.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
      )?.[1];

      if (!youtubeVideoId) {
        throw new Error("Invalid YouTube URL");
      }

      const videoMetadata = {
        title: values.title,
        description: values.description,
        youtubeUrl: values.link,
        embedUrl: getYoutubeEmbedUrl(values.link),
        thumbnail: getYoutubeThumbnail(values.link),
        category: values.language,
        batchId: values.batch,
        duration: 0,
        uploadDate: serverTimestamp(),
        uploadedBy: currentUser.uid,
        uploadedByName: currentUser.displayName || currentUser.email,
      };

      if (isEditMode && values.id) {
        const videoDocumentRef = doc(db, 'videos', values.id);
        await updateDoc(videoDocumentRef, {
          ...videoMetadata,
          uploadDate: serverTimestamp()
        });
        message.success("Video updated successfully!");
      } else {
        await addDoc(collection(db, 'videos'), videoMetadata);
      message.success("Video uploaded successfully!");
      }

      form.resetFields();
      setEmbedUrl("");
      setIsEditMode(false);
      setActiveTab('videos');
      fetchVideos();
    } catch (error) {
      console.error("Error handling video:", error);
      message.error("Failed to process video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setActiveTab('videos');
    setIsEditMode(false);
    form.resetFields();
    setEmbedUrl("");
  };

  const handleVideoPreview = (video) => {
    setSelectedVideo(video);
    setIsModalVisible(true);
  };

  const handleVideoDelete = async (videoId) => {
    try {
      await deleteDoc(doc(db, 'videos', videoId));
      message.success("Video deleted successfully!");
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      message.error("Failed to delete video");
    }
  };

  const handleVideoSearch = (value) => {
    setSearchText(value);
  };

  const handleCategoryFilter = (value) => {
    setSelectedCategory(value);
  };

  const handleOwnVideosFilter = (checked) => {
    setShowOnlyMine(checked);
  };

  const handleYouTubeLinkChange = (e) => {
    const url = e.target.value;
    setEmbedUrl(getYoutubeEmbedUrl(url));
  };

  const columns = [
    {
      title: 'Video',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 120,
      render: (thumbnail, record) => (
        <div style={{ position: 'relative', width: 120, height: 68 }}>
          <img
            src={thumbnail}
            alt={record.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '50%',
              padding: 8,
              cursor: 'pointer'
            }}
            onClick={() => handleVideoPreview(record)}
          >
            <PlayCircleOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
        </div>
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Text strong>{text}</Text>
          <Space size={8}>
            <Tag color="blue">{record.category}</Tag>
            <Tag color="green">{record.batchId}</Tag>
            {record.uploadedBy === currentUser.uid && (
              <Tag color="purple">Your Upload</Tag>
            )}
          </Space>
        </Space>
      )
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploadedByName',
      key: 'uploadedByName',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (timestamp) => (
        <Space>
          <CalendarOutlined />
          <Text>{timestamp?.toDate().toLocaleDateString()}</Text>
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Preview">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleVideoPreview(record)}
            />
          </Tooltip>
          {record.uploadedBy === currentUser.uid && (
            <>
              <Tooltip title="Edit">
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => handleVideoEdit(record)}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Popconfirm
                  title="Delete this video?"
                  description="Are you sure you want to delete this video?"
                  onConfirm={() => handleVideoDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesMine = !showOnlyMine || video.uploadedBy === currentUser.uid;
    return matchesSearch && matchesCategory && matchesMine;
  });

  return (
    <div style={{ 
      padding: '32px',
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 64px)',
      background: '#f8f9fa'
    }}>
      <div style={{ 
        marginBottom: '32px',
        textAlign: 'left'
      }}>
        <Title level={2} style={{ margin: 0 }}>Video Management</Title>
        <Text type="secondary">Upload and manage your training videos</Text>
      </div>

        <Card
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          style={{ 
            background: '#fff',
            padding: '16px 16px 0',
            margin: 0
          }}
          tabBarStyle={{ 
            margin: 0,
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <TabPane 
            tab={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <VideoCameraOutlined style={{ fontSize: '18px' }} />
                My Videos
              </span>
            } 
            key="videos"
          >
            <div style={{ padding: '24px' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <Input
                  placeholder="Search videos..."
                  prefix={<SearchOutlined />}
                  style={{ width: '300px' }}
                  size="large"
                  onChange={(e) => handleVideoSearch(e.target.value)}
                  value={searchText}
                />
                <Select
                  placeholder="Filter by category"
                  style={{ width: '200px' }}
                  size="large"
                  value={selectedCategory}
                  onChange={handleCategoryFilter}
                >
                  <Option value="all">All Categories</Option>
                  {LANGUAGES.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
                <Switch
                  checkedChildren="My Videos"
                  unCheckedChildren="All Videos"
                  checked={showOnlyMine}
                  onChange={handleOwnVideosFilter}
                />
              </div>

              <Table
                columns={columns}
                dataSource={filteredVideos}
                rowKey="id"
                loading={loading}
                pagination={{ 
                  pageSize: 8,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} videos`
                }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadOutlined style={{ fontSize: '18px' }} />
                {isEditMode ? 'Edit Video' : 'Upload Video'}
              </span>
            } 
            key="upload"
        >
            <div style={{ padding: '24px' }}>
          <Form
            form={form}
            layout="vertical"
                onFinish={handleVideoSubmit}
            autoComplete="off"
            initialValues={{ language: "", batch: "" }}
          >
                <Row gutter={[24, 16]}>
                  <Form.Item name="id" hidden>
                    <Input />
                  </Form.Item>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Video Title"
                  name="title"
                  rules={[{ required: true, message: "Please enter the video title" }]}
                >
                      <Input placeholder="Enter video title" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="YouTube Link"
                  name="link"
                  rules={[
                    { required: true, message: "Please enter a valid YouTube link" },
                    {
                      validator: (_, value) =>
                        !value || getYoutubeEmbedUrl(value)
                          ? Promise.resolve()
                          : Promise.reject("Enter a valid YouTube link"),
                    },
                  ]}
                >
                      <Input 
                        placeholder="Paste YouTube video link" 
                        onChange={handleYouTubeLinkChange}
                        size="large"
                      />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: "Please enter a description" }]}
                >
                      <Input.TextArea 
                        rows={2} 
                        placeholder="Describe the video content"
                        style={{ resize: 'none' }}
                      />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Language"
                  name="language"
                  rules={[{ required: true, message: "Please select a language" }]}
                >
                      <Select 
                        placeholder="Select language"
                        size="large"
                      >
                    {LANGUAGES.map((lang) => (
                      <Option key={lang} value={lang}>
                        {lang}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Batch Number"
                  name="batch"
                  rules={[{ required: true, message: "Please enter the batch number" }]}
                >
                      <Input 
                        placeholder="e.g. 2024A"
                        size="large"
                      />
                </Form.Item>
              </Col>
              <Col xs={24}>
                    <div style={{ 
                      marginBottom: '16px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #d9d9d9'
                    }}>
                  {embedUrl ? (
                        <div style={{ 
                          width: '100%',
                          aspectRatio: '16/9',
                          position: 'relative'
                        }}>
                    <iframe
                            style={{ 
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              border: 'none'
                            }}
                      src={embedUrl}
                      title="YouTube Preview"
                      allowFullScreen
                    />
                        </div>
                  ) : (
                        <div style={{ 
                          height: '400px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#fafafa'
                        }}>
                          <Text type="secondary">
                            Paste a valid YouTube link to preview
                          </Text>
                    </div>
                  )}
                </div>
              </Col>
                  <Col xs={24} style={{ textAlign: 'right' }}>
                    <Space>
                      <Button 
                        onClick={handleEditCancel}
                        size="large"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading} 
                        size="large"
                        style={{ minWidth: '120px' }}
                      >
                        {loading ? "Processing..." : isEditMode ? "Update Video" : "Upload Video"}
                </Button>
                    </Space>
              </Col>
            </Row>
          </Form>
            </div>
          </TabPane>
        </Tabs>
        </Card>

      {/* Preview Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlayCircleOutlined style={{ fontSize: '20px' }} />
            {selectedVideo?.title}
          </div>
        }
        open={!!selectedVideo}
        onCancel={() => setSelectedVideo(null)}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px' }}
      >
        {selectedVideo && (
          <div style={{ 
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
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