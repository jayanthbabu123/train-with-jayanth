import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Row, Col, Typography, Spin, Empty, Card, Space } from 'antd';
import CourseCard from '../../components/trainer/CourseCard';
import CreateCourseModal from '../../components/trainer/CreateCourseModal';
import CreateBatchModal from '../../components/trainer/CreateBatchModal';

const { Title, Paragraph } = Typography;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesQuery = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(coursesQuery);
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Title level={2} className="mb-1">Course Management</Title>
          <Paragraph className="text-muted mb-0">
            Create and manage your training courses and batches
          </Paragraph>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateCourseModalOpen(true)}
            size="large"
          >
            New Course
          </Button>
          <Button
            type="primary"
            icon={<TeamOutlined />}
            onClick={() => setIsCreateBatchModalOpen(true)}
            size="large"
            className="bg-success border-success"
          >
            New Batch
          </Button>
        </Space>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="text-center py-5">
          <Empty
            description={
              <>
                <Title level={4}>No Courses Yet</Title>
                <Paragraph className="text-muted mb-4">
                  Create your first course to get started!
                </Paragraph>
                <Button
                  type="primary"
                  onClick={() => setIsCreateCourseModalOpen(true)}
                >
                  Create Course
                </Button>
              </>
            }
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {courses.map((course) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
              <CourseCard
                course={course}
                onEdit={() => navigate(`/trainer/courses/${course.id}`)}
              />
            </Col>
          ))}
        </Row>
      )}

      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onSuccess={fetchCourses}
      />

      <CreateBatchModal
        isOpen={isCreateBatchModalOpen}
        onClose={() => setIsCreateBatchModalOpen(false)}
        courses={courses}
        onSuccess={fetchCourses}
      />
    </div>
  );
};

export default Courses; 