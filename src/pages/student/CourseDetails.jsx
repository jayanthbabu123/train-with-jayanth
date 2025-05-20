import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Typography, Tag, Button, Space, Row, Col, Tabs, Modal, Form, Input, Spin, Empty } from 'antd';
import { ClockCircleOutlined, TeamOutlined, BookOutlined, CheckCircleOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

export default function StudentCourseDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollModal, setEnrollModal] = useState(false);
  const [enrollForm] = Form.useForm();

  useEffect(() => {
    fetchDetails();
  }, [id, currentUser?.uid]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      // Fetch course
      const courseDoc = await getDoc(doc(db, 'courses', id));
      if (!courseDoc.exists()) {
        setCourse(null);
        setLoading(false);
        return;
      }
      setCourse({ id: courseDoc.id, ...courseDoc.data() });

      // Fetch batches
      const batchesQuery = query(collection(db, 'batches'), where('courseId', '==', id));
      const batchesSnap = await getDocs(batchesQuery);
      setBatches(batchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch enrollment
      if (currentUser?.uid) {
        const enrollQuery = query(collection(db, 'enrollments'), where('studentId', '==', currentUser.uid), where('courseId', '==', id));
        const enrollSnap = await getDocs(enrollQuery);
        setEnrollment(enrollSnap.docs.length > 0 ? { id: enrollSnap.docs[0].id, ...enrollSnap.docs[0].data() } : null);
      }
    } catch (e) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => setEnrollModal(true);

  const handleEnrollSubmit = async (values) => {
    try {
      await addDoc(collection(db, 'enrollments'), {
        ...values,
        courseId: course.id,
        courseTitle: course.title,
        studentId: currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Enrollment request submitted!');
      setEnrollModal(false);
      enrollForm.resetFields();
      fetchDetails();
    } catch (e) {
      toast.error('Failed to enroll');
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}><Spin size="large" /></div>;
  if (!course) return <Empty description="Course not found" />;

  return (
    <div className="container py-4">
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2' }}>
        <div style={{
          height: 140,
          background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24
        }}>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>{course.title}</Title>
        </div>
        <Space size="large" style={{ marginBottom: 16 }}>
          <Tag color="blue">{course.level}</Tag>
          <Tag color="green">{course.duration}</Tag>
          <Tag color="purple">{batches.length} Batches</Tag>
          <Tag color="magenta">{course.technologies?.length || 0} Tech</Tag>
        </Space>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>{course.description}</Paragraph>
        <div className="d-flex align-items-center gap-2 mb-3">
          {enrollment ? (
            enrollment.status === 'pending' ? <Tag color="orange">Pending Approval</Tag> :
            enrollment.status === 'active' ? <Tag color="green">Enrolled</Tag> :
            <Tag color="red">{enrollment.status}</Tag>
          ) : (
            <Button type="primary" onClick={handleEnroll}>Enroll in this Course</Button>
          )}
          {enrollment && enrollment.status === 'active' && (
            <Button type="primary" icon={<RightOutlined />}>Continue Learning</Button>
          )}
        </div>
        <Tabs defaultActiveKey="overview" style={{ marginTop: 24 }}>
          <TabPane tab={<span><BookOutlined /> Overview</span>} key="overview">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Card bordered={false} style={{ background: '#fafcff' }}>
                  <Title level={4}>About this Course</Title>
                  <Paragraph>{course.description}</Paragraph>
                  <Title level={5} style={{ marginTop: 24 }}>Technologies</Title>
                  <Space wrap>
                    {course.technologies?.length ? course.technologies.map((tech, i) => (
                      <Tag color="blue" key={i}>{tech}</Tag>
                    )) : <Text type="secondary">No technologies listed</Text>}
                  </Space>
                  <Title level={5} style={{ marginTop: 24 }}>Learning Outcomes</Title>
                  <ul style={{ paddingLeft: 20 }}>
                    {course.learningOutcomes?.length ? course.learningOutcomes.map((out, i) => (
                      <li key={i}><Text>{out}</Text></li>
                    )) : <Text type="secondary">No outcomes listed</Text>}
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} style={{ background: '#fafcff' }}>
                  <Title level={5}>Prerequisites</Title>
                  <ul style={{ paddingLeft: 20 }}>
                    {course.prerequisites?.length ? course.prerequisites.map((pre, i) => (
                      <li key={i}><Text>{pre}</Text></li>
                    )) : <Text type="secondary">No prerequisites</Text>}
                  </ul>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab={<span><TeamOutlined /> Batches</span>} key="batches">
            <Row gutter={[24, 24]}>
              {batches.length === 0 ? (
                <Col span={24}><Empty description="No batches yet" /></Col>
              ) : batches.map(batch => (
                <Col xs={24} md={12} key={batch.id}>
                  <Card bordered style={{ marginBottom: 16 }}>
                    <Title level={5}>{batch.name}</Title>
                    <Space direction="vertical">
                      <Text><CalendarOutlined /> {batch.startDate} - {batch.endDate}</Text>
                      <Text><ClockCircleOutlined /> {batch.schedule?.days?.join(', ')} {batch.schedule?.startTime} - {batch.schedule?.endTime}</Text>
                      <Text><TeamOutlined /> Max Students: {batch.maxStudents}</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Card>
      <Modal
        title={<Title level={4} className="mb-0">Enroll in Course</Title>}
        open={enrollModal}
        onCancel={() => {
          setEnrollModal(false);
          enrollForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={enrollForm}
          layout="vertical"
          onFinish={handleEnrollSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input size="large" />
          </Form.Item>
          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <Button 
              onClick={() => {
                setEnrollModal(false);
                enrollForm.resetFields();
              }}
              size="large"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
            >
              Submit Enrollment
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 