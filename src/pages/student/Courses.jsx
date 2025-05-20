import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { 
  Card, 
  Progress, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Spin, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Tabs, 
  Badge
} from 'antd';
import { 
  ClockCircleOutlined, 
  FileTextOutlined, 
  BookOutlined, 
  RightOutlined,
  TeamOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CARD_STYLE = {
  borderRadius: 16,
  minHeight: 340,
  boxShadow: '0 2px 8px #f0f1f2',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};
const HEADER_STYLE = {
  height: 120,
  background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
};

export default function StudentCourses() {
  const { currentUser } = useAuth();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [batchNames, setBatchNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('available');
  const tabsRef = useRef();

  useEffect(() => {
    fetchCourses();
  }, [currentUser.uid]);

  // Fetch batch names for assignedBatchIds
  useEffect(() => {
    const fetchBatchNames = async () => {
      const batchIds = enrolledCourses
        .map(e => e.assignedBatchId)
        .filter(id => !!id);
      const uniqueBatchIds = Array.from(new Set(batchIds));
      if (uniqueBatchIds.length === 0) return;
      const names = {};
      await Promise.all(uniqueBatchIds.map(async (batchId) => {
        try {
          const batchDoc = await getDoc(doc(db, 'batches', batchId));
          if (batchDoc.exists()) {
            names[batchId] = batchDoc.data().name || batchId;
          } else {
            names[batchId] = batchId;
          }
        } catch {
          names[batchId] = batchId;
        }
      }));
      setBatchNames(names);
    };
    fetchBatchNames();
  }, [enrolledCourses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch available courses
      const coursesQuery = query(collection(db, 'courses'));
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableCourses(coursesList);
      // Fetch enrolled courses (enrollments)
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('studentId', '==', currentUser.uid)
      );
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const enrollmentsList = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Fetch all course details for enrolled courses
      const enrolledCourseIds = enrollmentsList.map(e => e.courseId);
      const courseDetailsMap = {};
      if (enrolledCourseIds.length > 0) {
        const allCoursesQuery = query(collection(db, 'courses'));
        const allCoursesSnapshot = await getDocs(allCoursesQuery);
        allCoursesSnapshot.docs.forEach(doc => {
          if (enrolledCourseIds.includes(doc.id)) {
            courseDetailsMap[doc.id] = { id: doc.id, ...doc.data() };
          }
        });
      }
      // Merge course details into enrollments
      const enrichedEnrollments = enrollmentsList.map(enrollment => ({
        ...enrollment,
        course: courseDetailsMap[enrollment.courseId] || {}
      }));
      setEnrolledCourses(enrichedEnrollments);
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (course) => {
    setSelectedCourse(course);
    setIsEnrollModalOpen(true);
  };

  const handleEnrollSubmit = async (values) => {
    try {
      // Fetch course to get trainerId (createdBy)
      const courseDoc = await getDoc(doc(db, 'courses', selectedCourse.id));
      const courseData = courseDoc.data();
      await addDoc(collection(db, 'enrollments'), {
        studentId: currentUser.uid,
        studentName: values.name,
        studentEmail: values.email,
        studentPhone: values.phone,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        trainerId: courseData.createdBy || '',
        status: 'pending',
        assignedBatchId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Enrollment request submitted successfully');
      setIsEnrollModalOpen(false);
      enrollForm.resetFields();
      fetchCourses();
    } catch (error) {
      toast.error('Failed to submit enrollment request');
      console.error('Error submitting enrollment:', error);
    }
  };

  // For enrolled courses, use merged course+enrollment data
  const renderEnrolledCourseCard = (enrollment) => {
    const course = enrollment.course || {};
    const batchName = enrollment.assignedBatchId ? batchNames[enrollment.assignedBatchId] : null;
    return (
      <Col xs={24} md={12} lg={8} xl={6} key={enrollment.id}>
        <Card
          hoverable
          className="h-100"
          bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', height: '220px', justifyContent: 'space-between' }}
          style={CARD_STYLE}
          cover={
            <div style={HEADER_STYLE}>
              <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 700, textAlign: 'center', width: '100%' }}>{course.title}</Title>
            </div>
          }
        >
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Space>
              <Tag color="blue" style={{ fontSize: 13 }}>{course.level}</Tag>
              <Tag color="green" style={{ fontSize: 13 }}>{course.duration}</Tag>
              {batchName && (
                <Tag color="blue" style={{ fontSize: 13 }}>Batch: {batchName}</Tag>
              )}
            </Space>
            <Text type="secondary" style={{ fontSize: 14 }}>{course.description}</Text>
            <Space size={16} style={{ fontSize: 14 }}>
              <TeamOutlined />
              <span>{course.batches?.length || 0} Batches</span>
              <BookOutlined />
              <span>{course.technologies?.length || 0} Tech</span>
            </Space>
            <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2" style={{ fontSize: 14 }}>
              <Button type="link" size="small" style={{ padding: 0 }} onClick={() => window.location.href = `/student/courses/${enrollment.courseId}`}>
                View Details
              </Button>
              <Space>
                {enrollment.status === 'pending' && (
                  <Tag color="orange" style={{ fontSize: 13 }}>Pending</Tag>
                )}
                {enrollment.status === 'active' && (
                  <Button type="primary" size="small">Continue Learning</Button>
                )}
              </Space>
            </div>
          </Space>
        </Card>
      </Col>
    );
  };

  const renderCourseCard = (course, isEnrolled = false) => (
    <Col xs={24} md={12} lg={8} xl={6} key={course.id}>
      <Card
        hoverable
        className="h-100"
        bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', height: '220px', justifyContent: 'space-between' }}
        style={CARD_STYLE}
        cover={
          <div style={HEADER_STYLE}>
            <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 700, textAlign: 'center', width: '100%' }}>{course.title}</Title>
          </div>
        }
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Space>
            <Tag color="blue" style={{ fontSize: 13 }}>{course.level}</Tag>
            <Tag color="green" style={{ fontSize: 13 }}>{course.duration}</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 14 }}>{course.description}</Text>
          <Space size={16} style={{ fontSize: 14 }}>
            <TeamOutlined />
            <span>{course.batches?.length || 0} Batches</span>
            <BookOutlined />
            <span>{course.technologies?.length || 0} Tech</span>
          </Space>
          <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2" style={{ fontSize: 14 }}>
            <Button type="link" size="small" style={{ padding: 0 }} onClick={() => window.location.href = `/student/courses/${course.id}`}>
              View Details
            </Button>
            {!isEnrolled && (
              <Button type="primary" size="small" onClick={() => handleEnroll(course)}>
                Enroll
              </Button>
            )}
            {isEnrolled && course.status === 'pending' && (
              <Tag color="orange" style={{ fontSize: 13 }}>Pending</Tag>
            )}
            {isEnrolled && course.status === 'active' && (
              <Button type="primary" size="small">Continue Learning</Button>
            )}
          </div>
        </Space>
      </Card>
    </Col>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Title level={2} style={{ margin: 0, color: '#222' }}>My Courses</Title>
        <Text type="secondary">Browse available courses and track your learning progress</Text>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarGutter={48}
        size="large"
        tabBarStyle={{ fontWeight: 600, fontSize: 18, marginBottom: 24 }}
      >
        <TabPane 
          tab={
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge count={availableCourses.length} offset={[8, 0]}>
                <TeamOutlined style={{ fontSize: 20 }} />
              </Badge>
              <span>Available Courses</span>
            </span>
          }
          key="available"
        >
          <Row gutter={[24, 24]}>
            {availableCourses.length === 0 ? (
              <Col span={24}>
                <Card className="text-center py-5">
                  <Title level={4}>No Courses Available</Title>
                  <Text type="secondary">
                    Check back later for new courses
                  </Text>
                </Card>
              </Col>
            ) : (
              availableCourses.map(course => renderCourseCard(course))
            )}
          </Row>
        </TabPane>

        <TabPane 
          tab={
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge count={enrolledCourses.length} offset={[8, 0]}>
                <BookOutlined style={{ fontSize: 20 }} />
              </Badge>
              <span>Enrolled Courses</span>
            </span>
          }
          key="enrolled"
        >
          <Row gutter={[24, 24]}>
            {enrolledCourses.length === 0 ? (
              <Col span={24}>
                <Card className="text-center py-5">
                  <Title level={4}>No Enrolled Courses</Title>
                  <Text type="secondary" className="d-block mb-4">
                    You haven't enrolled in any courses yet
                  </Text>
                  <Button 
                    type="primary"
                    onClick={() => setActiveTab('available')}
                  >
                    Browse Courses
                  </Button>
                </Card>
              </Col>
            ) : (
              enrolledCourses.map(enrollment => renderEnrolledCourseCard(enrollment))
            )}
          </Row>
        </TabPane>
      </Tabs>

      <Modal
        title={<Title level={4} className="mb-0">Enroll in Course</Title>}
        open={isEnrollModalOpen}
        onCancel={() => {
          setIsEnrollModalOpen(false);
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
                setIsEnrollModalOpen(false);
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