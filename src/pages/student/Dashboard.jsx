import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, orderBy, getDocs, startAfter, limit, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { Row, Col, Card, Spin, Typography, Divider, Tag } from 'antd';
import PageHeader from '../../components/common/PageHeader';
import {
  CheckCircleTwoTone,
  CalendarTwoTone,
  BookTwoTone,
  FireTwoTone,
  ClockCircleOutlined,
  TrophyOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  BookOutlined,
} from '@ant-design/icons';
import FeedList from '../../components/FeedList';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

// Consistent card styles for all cards without borders
const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  border: "none",
  boxShadow: "0 4px 16px rgba(0, 103, 184, 0.08)",
  height: "100%",
  transition: "all 0.3s ease",
};

const cardHoverStyle = {
  ...cardStyle,
  boxShadow: "0 8px 24px rgba(0, 103, 184, 0.12)",
  transform: "translateY(-4px)",
};

// Special styles for quick access cards (Courses, Videos, Assignments, Quizzes) with light black border
const quickAccessCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #d1d5db",
  boxShadow: "0 4px 16px rgba(0, 103, 184, 0.08)",
  height: "100%",
  transition: "all 0.3s ease",
};

const quickAccessCardHoverStyle = {
  ...quickAccessCardStyle,
  border: "1px solid #9ca3af",
  boxShadow: "0 8px 24px rgba(0, 103, 184, 0.12)",
  transform: "translateY(-4px)",
};

const cardBodyStyle = {
  padding: "20px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

// Icon backgrounds for quick access cards
const iconColors = [
  "#0067b8", // blue
  "#722ed1", // purple
  "#faad14", // yellow/orange
  "#52c41a"  // green
];

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
  const [hoveredCard, setHoveredCard] = useState(null);

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

  // Quick Access Cards Data
  const quickAccess = [
    {
      title: 'Courses',
      icon: <BookOutlined style={{ fontSize: 28, color: "#fff" }} />,
      link: '/student/courses',
      description: 'Browse all your enrolled courses',
      iconColor: iconColors[0]
    },
    {
      title: 'Assignments',
      icon: <FileDoneOutlined style={{ fontSize: 28, color: "#fff" }} />,
      link: '/student/assignments',
      description: 'View and submit your assignments',
      iconColor: iconColors[1]
    },
    {
      title: 'Quizzes',
      icon: <FileTextOutlined style={{ fontSize: 28, color: "#fff" }} />,
      link: '/student/quizzes',
      description: 'Take quizzes and check results',
      iconColor: iconColors[2]
    },
    {
      title: 'Videos',
      icon: <VideoCameraOutlined style={{ fontSize: 28, color: "#fff" }} />,
      link: '/student/videos',
      description: 'Watch course videos',
      iconColor: iconColors[3]
    },
  ];

  return (
    <div style={{ background: '#f7fafd', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <PageHeader
          title={`Welcome back, ${currentUser.displayName}!`}
          subtitle="Your learning journey at a glance"
          titleColor={BRAND_COLOR}
        />
        <Row gutter={[32, 32]} align="stretch">
          {/* Left: Analytics */}
          <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Quick Access Cards */}
            <Row gutter={[20, 20]}>
              {quickAccess.map((item, idx) => (
                <Col span={12} key={item.title}>
                  <Link to={item.link} style={{ textDecoration: 'none' }}>
                    <Card
                      bordered={false}
                      hoverable
                      style={hoveredCard === `quick-${idx}` ? quickAccessCardHoverStyle : quickAccessCardStyle}
                      bodyStyle={{
                        ...cardBodyStyle,
                        padding: '20px',
                        minHeight: '140px'
                      }}
                      onMouseEnter={() => setHoveredCard(`quick-${idx}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: `linear-gradient(135deg, ${item.iconColor} 0%, ${item.iconColor}dd 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 4px 16px ${item.iconColor}30, 0 2px 8px rgba(0, 0, 0, 0.1)`,
                            border: `1px solid ${item.iconColor}20`,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Subtle shine effect */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                            pointerEvents: 'none'
                          }} />
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Title level={4} style={{ margin: 0, color: BRAND_COLOR, fontWeight: 700 }}>
                            {item.title}
                          </Title>
                          <Text type="secondary" style={{ fontSize: 13, color: "#666", lineHeight: 1.4 }}>
                            {item.description}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>

            {/* Stats Cards */}
            <Row gutter={[20, 20]}>
              <Col span={12}>
                <Card 
                  bordered={false} 
                  style={hoveredCard === 'stat-1' ? cardHoverStyle : cardStyle}
                  bodyStyle={cardBodyStyle}
                  onMouseEnter={() => setHoveredCard('stat-1')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="d-flex align-items-center">
                    <CheckCircleTwoTone twoToneColor={BRAND_COLOR} style={{ fontSize: 36, marginRight: 16 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>Completed</Text>
                      <div>
                        <Title level={2} style={{ margin: 0, color: BRAND_COLOR, fontWeight: 700 }}>
                          {stats.completedAssignments}
                        </Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  bordered={false} 
                  style={hoveredCard === 'stat-2' ? cardHoverStyle : cardStyle}
                  bodyStyle={cardBodyStyle}
                  onMouseEnter={() => setHoveredCard('stat-2')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="d-flex align-items-center">
                    <CalendarTwoTone twoToneColor={['#52c41a', '#a0d911']} style={{ fontSize: 36, marginRight: 16 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>Upcoming</Text>
                      <div>
                        <Title level={2} style={{ margin: 0, color: '#52c41a', fontWeight: 700 }}>
                          {stats.upcomingSessions}
                        </Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  bordered={false} 
                  style={hoveredCard === 'stat-3' ? cardHoverStyle : cardStyle}
                  bodyStyle={cardBodyStyle}
                  onMouseEnter={() => setHoveredCard('stat-3')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="d-flex align-items-center">
                    <BookTwoTone twoToneColor={['#722ed1', '#b37feb']} style={{ fontSize: 36, marginRight: 16 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>Courses</Text>
                      <div>
                        <Title level={2} style={{ margin: 0, color: '#722ed1', fontWeight: 700 }}>
                          {stats.totalCourses}
                        </Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  bordered={false} 
                  style={hoveredCard === 'stat-4' ? cardHoverStyle : cardStyle}
                  bodyStyle={cardBodyStyle}
                  onMouseEnter={() => setHoveredCard('stat-4')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="d-flex align-items-center">
                    <TrophyOutlined style={{ fontSize: 36, marginRight: 16, color: '#faad14' }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>Streak</Text>
                      <div>
                        <Title level={2} style={{ margin: 0, color: '#faad14', fontWeight: 700 }}>
                          {stats.streakDays}d
                        </Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Next Session Card */}
            {stats.nextSession && (
              <Card 
                bordered={false} 
                style={hoveredCard === 'session' ? cardHoverStyle : cardStyle}
                bodyStyle={cardBodyStyle}
                onMouseEnter={() => setHoveredCard('session')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <ClockCircleOutlined style={{ fontSize: 24, color: BRAND_COLOR }} />
                  <Title level={4} style={{ margin: 0, color: BRAND_COLOR }}>Next Session</Title>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                  borderRadius: 12, 
                  padding: 18,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}>
                  <Text strong style={{ fontSize: 16, color: '#1a202c' }}>
                    {stats.nextSession.title}
                  </Text>
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
          </Col>

          {/* Right: Feed */}
          <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <Card 
              bordered={false} 
              style={{
                ...cardStyle,
                minHeight: 500
              }}
              bodyStyle={{
                ...cardBodyStyle,
                padding: '24px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <FireTwoTone twoToneColor={['#fa541c', '#faad14']} style={{ fontSize: 28 }} />
                  <Title level={4} style={{ 
                    margin: 0, 
                    color: BRAND_COLOR, 
                    fontWeight: 700, 
                    letterSpacing: 0.2 
                  }}>
                    Trainer Feed
                  </Title>
                </div>
                <Text type="secondary" style={{ fontSize: 14, color: '#666' }}>
                  Stay updated with the latest posts, tips, and resources from your trainers
                </Text>
              </div>
              <Divider style={{ margin: '20px 0' }} />
              <div style={{ flex: 1 }}>
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