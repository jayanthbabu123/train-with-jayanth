import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  TeamOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined, 
  BookOutlined, 
  CodeOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { 
  Button, 
  Typography, 
  Spin, 
  Card, 
  Tabs, 
  Tag, 
  Space, 
  Row, 
  Col, 
  List, 
  Empty 
} from 'antd';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const courseDoc = await getDoc(doc(db, 'courses', id));
      if (courseDoc.exists()) {
        setCourse({ id: courseDoc.id, ...courseDoc.data() });
        
        const batchesQuery = query(
          collection(db, 'batches'),
          where('courseId', '==', id)
        );
        const batchesSnapshot = await getDocs(batchesQuery);
        const batchesData = batchesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBatches(batchesData);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-5">
        <Title level={2}>Course not found</Title>
      </div>
    );
  }

  const renderOverview = () => (
    <Space direction="vertical" size="large" className="w-100">
      <Card>
        <Title level={4}>Description</Title>
        <Paragraph className="text-muted">{course.description}</Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Prerequisites</Title>
            <List
              dataSource={course.prerequisites}
              renderItem={item => (
                <List.Item>
                  <Space>
                    <CheckCircleOutlined className="text-primary" />
                    <span className="text-muted">{item}</span>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Course Details</Title>
            <Space direction="vertical" className="w-100">
              <div className="d-flex align-items-center text-muted">
                <ClockCircleOutlined className="me-2 text-primary" />
                <span>Duration: {course.duration}</span>
              </div>
              <div className="d-flex align-items-center text-muted">
                <BookOutlined className="me-2 text-primary" />
                <span>Level: {course.level}</span>
              </div>
              <div className="d-flex align-items-center text-muted">
                <TeamOutlined className="me-2 text-primary" />
                <span>Active Batches: {batches.length}</span>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );

  const renderBatches = () => (
    <Space direction="vertical" size="large" className="w-100">
      <div className="d-flex justify-content-between align-items-center">
        <Title level={4}>Course Batches</Title>
        <Button
          type="primary"
          icon={<TeamOutlined />}
          onClick={() => navigate('/trainer/courses')}
        >
          New Batch
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {batches.length === 0 ? (
          <Col span={24}><Empty description="No batches yet" /></Col>
        ) : batches.map(batch => (
          <Col xs={24} md={12} lg={8} xl={6} key={batch.id}>
            <Card
              hoverable
              style={{ borderRadius: 16, minHeight: 260, boxShadow: '0 2px 8px #f0f1f2', width: '100%' }}
              bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', height: '200px', justifyContent: 'space-between' }}
            >
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <Title level={5} style={{ margin: 0 }}>{batch.name}</Title>
                  <Tag color="blue">{batch.status || 'Upcoming'}</Tag>
                </div>
                <Space size={12} style={{ fontSize: 14 }}>
                  <CalendarOutlined />
                  <span>{batch.startDate || '-'} - {batch.endDate || '-'}</span>
                </Space>
                <Space size={12} style={{ fontSize: 14 }}>
                  <ClockCircleOutlined />
                  <span>{batch.schedule?.days?.join(', ') || 'No days'} {batch.schedule?.startTime} - {batch.schedule?.endTime}</span>
                </Space>
                <Space size={12} style={{ fontSize: 14 }}>
                  <TeamOutlined />
                  <span>Max Students: {batch.maxStudents}</span>
                </Space>
                {batch.technologies && batch.technologies.length > 0 && (
                  <Space size={4} wrap style={{ fontSize: 13 }}>
                    {batch.technologies.map((tech, idx) => (
                      <Tag color="purple" key={idx}>{tech}</Tag>
                    ))}
                  </Space>
                )}
                <div className="d-flex justify-content-end mt-2">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => window.location.href = `/trainer/batches/${batch.id}`}
                  >
                    Manage Batch
                  </Button>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );

  const renderTechnologies = () => (
    <Card>
      <Title level={4}>Technologies</Title>
      <Space wrap>
        {course.technologies?.map((tech, index) => (
          <Tag color="blue" key={index} className="p-2">
            {tech}
          </Tag>
        ))}
      </Space>
    </Card>
  );

  const renderOutcomes = () => (
    <Card>
      <Title level={4}>Learning Outcomes</Title>
      <List
        dataSource={course.learningOutcomes}
        renderItem={item => (
          <List.Item>
            <Space>
              <CheckCircleOutlined className="text-success" />
              <span className="text-muted">{item}</span>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <div className="container py-4">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/trainer/courses')}
        className="mb-4 p-0"
      >
        Back to Courses
      </Button>

      <div className="mb-4">
        <Title level={2}>Course Details</Title>
        <Paragraph className="text-muted">
          Manage your course content, batches, and learning materials
        </Paragraph>
      </div>

      <Card className="mb-4">
        <div 
          className="position-relative mb-4" 
          style={{ 
            height: '180px',
            background: 'linear-gradient(to right, #1890ff, #722ed1)'
          }}
        >
          <div 
            className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0, 0, 0, 0.2)' }}
          >
            <Title level={3} className="text-white text-center mb-0 px-4">
              {course.title}
            </Title>
          </div>
        </div>

        <Space size="middle" className="mb-4">
          <Tag color="blue" icon={<BookOutlined />}>
            {course.level}
          </Tag>
          <Tag color="green" icon={<ClockCircleOutlined />}>
            {course.duration}
          </Tag>
          <Tag color="purple" icon={<TeamOutlined />}>
            {batches.length} Batches
          </Tag>
        </Space>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <BookOutlined />
                Overview
              </span>
            } 
            key="overview"
          >
            {renderOverview()}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                Batches
              </span>
            } 
            key="batches"
          >
            {renderBatches()}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <CodeOutlined />
                Technologies
              </span>
            } 
            key="technologies"
          >
            {renderTechnologies()}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                Learning Outcomes
              </span>
            } 
            key="outcomes"
          >
            {renderOutcomes()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CourseDetails; 