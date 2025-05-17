import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { Row, Col, Card, Spin, Typography, Empty } from 'antd';
import { CheckCircleTwoTone, CalendarTwoTone, BookTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    completedAssignments: 0,
    upcomingSessions: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch assignments
        const assignmentsQuery = query(
          collection(db, 'assignments'),
          where('studentId', '==', currentUser.uid)
        );
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        const completedAssignments = assignmentsSnapshot.docs.filter(
          doc => doc.data().status === 'completed'
        ).length;

        // Fetch upcoming sessions
        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('studentId', '==', currentUser.uid),
          where('status', '==', 'upcoming')
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const upcomingSessions = sessionsSnapshot.docs.length;

        // Fetch courses
        const coursesQuery = query(
          collection(db, 'enrollments'),
          where('studentId', '==', currentUser.uid)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const totalCourses = coursesSnapshot.docs.length;

        setStats({
          completedAssignments,
          upcomingSessions,
          totalCourses
        });
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser.uid]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" style={{ color: BRAND_COLOR }} />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Title level={2} style={{ color: '#222', marginBottom: 0 }}>
          Welcome back, {currentUser.displayName}!
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Here's an overview of your learning progress
        </Text>
      </div>

      {/* Stats Grid */}
      <Row gutter={[24, 24]} className="mb-4">
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2' }}>
            <div className="d-flex align-items-center">
              <CheckCircleTwoTone twoToneColor={BRAND_COLOR} style={{ fontSize: 36, marginRight: 16 }} />
              <div>
                <Text type="secondary">Completed Assignments</Text>
                <div>
                  <Title level={3} style={{ margin: 0 }}>{stats.completedAssignments}</Title>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2' }}>
            <div className="d-flex align-items-center">
              <CalendarTwoTone twoToneColor={[BRAND_COLOR, '#52c41a']} style={{ fontSize: 36, marginRight: 16 }} />
              <div>
                <Text type="secondary">Upcoming Sessions</Text>
                <div>
                  <Title level={3} style={{ margin: 0 }}>{stats.upcomingSessions}</Title>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2' }}>
            <div className="d-flex align-items-center">
              <BookTwoTone twoToneColor={[BRAND_COLOR, '#722ed1']} style={{ fontSize: 36, marginRight: 16 }} />
              <div>
                <Text type="secondary">Enrolled Courses</Text>
                <div>
                  <Title level={3} style={{ margin: 0 }}>{stats.totalCourses}</Title>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2' }}>
        <Title level={4} style={{ marginBottom: 16, color: '#222' }}>Recent Activity</Title>
        <Empty description={<span style={{ color: '#888' }}>No recent activity to show</span>} />
      </Card>
    </div>
  );
} 