import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { Card, Progress, Button, Row, Col, Typography, Tag, Spin, Space } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, BookOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StudentCourses() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, 'enrollments'),
          where('studentId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const courseList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(courseList);
      } catch (error) {
        toast.error('Failed to fetch courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentUser.uid]);

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
        <Text type="secondary">Track your learning progress and access course materials</Text>
      </div>

      <Row gutter={[24, 24]}>
        {courses.map((course) => (
          <Col xs={24} md={12} lg={8} key={course.id}>
            <Card
              hoverable
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px #f0f1f2',
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    height: 160,
                    background: 'linear-gradient(90deg, var(--primary-color) 0%, #1e3a8a 100%)',
                  }}
                />
                <Tag
                  color={course.status === 'active' ? 'success' : 'default'}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    borderRadius: 12,
                    padding: '4px 8px',
                  }}
                >
                  {course.status}
                </Tag>
              </div>

              <div style={{ padding: '16px' }}>
                <Title level={4} style={{ marginBottom: 8 }}>{course.title}</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                  {course.description}
                </Text>

                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Space>
                    <ClockCircleOutlined />
                    <Text type="secondary">
                      Progress: <Text strong>{course.progress || 0}%</Text>
                    </Text>
                  </Space>
                  <Space>
                    <FileTextOutlined />
                    <Text type="secondary">
                      {course.assignmentCount || 0} Assignments
                    </Text>
                  </Space>

                  <Progress
                    percent={course.progress || 0}
                    showInfo={false}
                    strokeColor={{
                      '0%': 'var(--primary-color)',
                      '100%': '#1e3a8a',
                    }}
                    style={{ marginTop: 8 }}
                  />

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button type="text" icon={<BookOutlined />}>
                      View Materials
                    </Button>
                    <Button type="primary" icon={<RightOutlined />}>
                      Continue Learning
                    </Button>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
} 