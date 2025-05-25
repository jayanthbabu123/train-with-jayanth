import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, orderBy, getDocs, startAfter, limit, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { Row, Col, Card, Spin, Typography, Empty, Divider, Progress, Tag, Space, Tooltip } from 'antd';
import { 
  CheckCircleTwoTone, 
  CalendarTwoTone, 
  BookTwoTone, 
  FireTwoTone,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import FeedList from '../../components/FeedList';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    completedAssignments: 0,
    upcomingSessions: 0,
    totalCourses: 0,
    totalAssignments: 0,
    averageScore: 0,
    streakDays: 0,
    nextSession: null,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // Feed state
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedLastDoc, setFeedLastDoc] = useState(null);
  const [feedHasMore, setFeedHasMore] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchFeed(true);
    // eslint-disable-next-line
  }, [currentUser.uid]);

  const fetchStats = async () => {
    try {
      // Fetch assignments with more details
      const assignmentsQuery = query(
        collection(db, 'assignments'),
        where('studentId', '==', currentUser.uid)
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const assignments = assignmentsSnapshot.docs.map(doc => doc.data());
      const completedAssignments = assignments.filter(a => a.status === 'completed').length;
      const totalAssignments = assignments.length;
      const averageScore = assignments.length > 0 
        ? assignments.reduce((acc, curr) => acc + (curr.score || 0), 0) / assignments.length 
        : 0;

      // Fetch upcoming sessions with more details
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('date', '>=', new Date()),
        orderBy('date', 'asc'),
        limit(1)
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const nextSession = sessionsSnapshot.docs[0]?.data();
      const upcomingSessions = sessionsSnapshot.docs.length;

      // Fetch courses with more details
      const coursesQuery = query(
        collection(db, 'enrollments'),
        where('studentId', '==', currentUser.uid)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const totalCourses = coursesSnapshot.docs.length;

      // Calculate streak (mock data for now)
      const streakDays = Math.floor(Math.random() * 7) + 1;

      // Get recent activity (mock data for now)
      const recentActivity = [
        { type: 'assignment', title: 'Completed JavaScript Basics', date: new Date() },
        { type: 'course', title: 'Started React Course', date: new Date() },
        { type: 'session', title: 'Attended Live Session', date: new Date() }
      ];

      setStats({
        completedAssignments,
        upcomingSessions,
        totalCourses,
        totalAssignments,
        averageScore,
        streakDays,
        nextSession,
        recentActivity
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Feed fetching with pagination
  const fetchFeed = async (reset = false) => {
    setFeedLoading(true);
    try {
      let q = query(collection(db, 'feeds'), orderBy('createdAt', 'desc'), limit(10));
      if (!reset && feedLastDoc) {
        q = query(collection(db, 'feeds'), orderBy('createdAt', 'desc'), startAfter(feedLastDoc), limit(10));
      }
      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (reset) {
        setFeedPosts(newPosts);
      } else {
        setFeedPosts(prev => [...prev, ...newPosts]);
      }
      setFeedLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setFeedHasMore(snapshot.docs.length === 10);
    } catch (error) {
      toast.error('Failed to load feed');
    } finally {
      setFeedLoading(false);
    }
  };

  const handleFeedLoadMore = () => {
    if (!feedLoading && feedHasMore) {
      fetchFeed(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" style={{ color: BRAND_COLOR }} />
      </div>
    );
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#52c41a';
    if (percentage >= 50) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div style={{ background: '#f7fafd', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Row gutter={[40, 40]} align="stretch">
          {/* Left: Analytics */}
          <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="mb-4">
              <Title level={2} style={{ color: BRAND_COLOR, marginBottom: 0, fontWeight: 800, letterSpacing: 0.5 }}>
                Welcome back, {currentUser.displayName}!
              </Title>
              <Text type="secondary" style={{ fontSize: 18, fontWeight: 500 }}>
                Your learning journey at a glance
              </Text>
            </div>

            {/* Progress Overview Card */}
            <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0 4px 24px #e6f1ff', background: '#fff' }}>
              <Title level={4} style={{ marginBottom: 24, color: '#222' }}>Learning Progress</Title>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>Assignment Completion</Text>
                    <Text>{stats.completedAssignments}/{stats.totalAssignments}</Text>
                  </div>
                  <Progress 
                    percent={stats.totalAssignments ? (stats.completedAssignments / stats.totalAssignments) * 100 : 0} 
                    strokeColor={getProgressColor(stats.totalAssignments ? (stats.completedAssignments / stats.totalAssignments) * 100 : 0)}
                    showInfo={false}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>Average Score</Text>
                    <Text>{stats.averageScore.toFixed(1)}%</Text>
                  </div>
                  <Progress 
                    percent={stats.averageScore} 
                    strokeColor={getProgressColor(stats.averageScore)}
                    showInfo={false}
                  />
                </div>
              </Space>
            </Card>

            {/* Stats Cards */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0 4px 24px #e6f1ff', background: '#fff', height: '100%' }}>
                  <div className="d-flex align-items-center">
                    <CheckCircleTwoTone twoToneColor={BRAND_COLOR} style={{ fontSize: 38, marginRight: 18 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 16 }}>Completed</Text>
                      <div>
                        <Title level={2} style={{ margin: 0, color: BRAND_COLOR, fontWeight: 700 }}>{stats.completedAssignments}</Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0 4px 24px #e6f1ff', background: '#fff', height: '100%' }}>
                  <div className="d-flex align-items-center">
                    <CalendarTwoTone twoToneColor={[BRAND_COLOR, '#52c41a']} style={{ fontSize: 38, marginRight: 18 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 16 }}>Upcoming</Text>
                      <div>
                        <Title level={2} style={{ margin: 0, color: '#52c41a', fontWeight: 700 }}>{stats.upcomingSessions}</Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0 4px 24px #e6f1ff', background: '#fff', height: '100%' }}>
                  <div className="d-flex align-items-center">
                    <BookTwoTone twoToneColor={[BRAND_COLOR, '#722ed1']} style={{ fontSize: 38, marginRight: 18 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 16 }}>Courses</Text>
                      <div>
                        <Title level={2} style={{ margin: 0, color: '#722ed1', fontWeight: 700 }}>{stats.totalCourses}</Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0 4px 24px #e6f1ff', background: '#fff', height: '100%' }}>
                  <div className="d-flex align-items-center">
                    <TrophyOutlined style={{ fontSize: 38, marginRight: 18, color: '#faad14' }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 16 }}>Streak</Text>
                      <div>
                        <Title level={2} style={{ margin: 0, color: '#faad14', fontWeight: 700 }}>{stats.streakDays}d</Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Next Session Card */}
            {stats.nextSession && (
              <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0 4px 24px #e6f1ff', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <ClockCircleOutlined style={{ fontSize: 24, color: BRAND_COLOR }} />
                  <Title level={4} style={{ margin: 0 }}>Next Session</Title>
                </div>
                <div style={{ background: '#f5f7fa', borderRadius: 12, padding: 16 }}>
                  <Text strong style={{ fontSize: 16 }}>{stats.nextSession.title}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue" style={{ marginRight: 8 }}>
                      {new Date(stats.nextSession.date).toLocaleDateString()}
                    </Tag>
                    <Tag color="green">
                      {new Date(stats.nextSession.date).toLocaleTimeString()}
                    </Tag>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Activity Card */}
            <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0 4px 24px #e6f1ff', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <TeamOutlined style={{ fontSize: 24, color: BRAND_COLOR }} />
                <Title level={4} style={{ margin: 0 }}>Recent Activity</Title>
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} style={{ 
                    padding: 12, 
                    background: '#f5f7fa', 
                    borderRadius: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <Text strong>{activity.title}</Text>
                      <div>
                        <Tag color={activity.type === 'assignment' ? 'blue' : activity.type === 'course' ? 'purple' : 'green'}>
                          {activity.type}
                        </Tag>
                      </div>
                    </div>
                    <Text type="secondary">{activity.date.toLocaleDateString()}</Text>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
          {/* Right: Feed */}
          <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <Card bordered={false} style={{ borderRadius: 18, boxShadow: '0 4px 24px #e6f1ff', minHeight: 400, background: '#fff', padding: 0 }}>
              <div style={{ padding: '32px 32px 0 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <FireTwoTone twoToneColor={['#fa541c', '#faad14']} style={{ fontSize: 28 }} />
                  <Title level={4} style={{ margin: 0, color: '#222', fontWeight: 700, letterSpacing: 0.2 }}>Trainer Feed</Title>
                </div>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Stay updated with the latest posts, tips, and resources from your trainers
                </Text>
              </div>
              <Divider style={{ margin: '24px 0 0 0' }} />
              <div style={{ padding: '0 32px 32px 32px' }}>
                <FeedList
                  feeds={feedPosts}
                  loading={feedLoading}
                  hasMore={feedHasMore}
                  onLoadMore={handleFeedLoadMore}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
} 