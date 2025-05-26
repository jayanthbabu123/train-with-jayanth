import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Avatar, 
  Tag, 
  Button, 
  Spin, 
  Typography,
  Space,
  Statistic,
  Progress,
  Tabs,
  List,
  Empty,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  CheckCircleTwoTone, 
  ClockCircleTwoTone, 
  UsergroupAddOutlined,
  MailOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  FileTextOutlined,
  BookOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  BellOutlined,
  FormOutlined,
  PieChartOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  DashboardOutlined,
  CodeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/plots';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const BRAND_COLOR = '#0067b8';

export default function NewTrainerDashboard() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch students
        const studentsRef = collection(db, 'users');
        const studentsQuery = query(studentsRef, where('role', '==', 'student'));
        const studentsSnapshot = await getDocs(studentsQuery);
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() // Convert Firestore timestamp to Date
        }));
        setStudents(studentsData);

        // Fetch assignments
        const assignmentsRef = collection(db, 'assignments');
        const assignmentsQuery = query(assignmentsRef, orderBy('createdAt', 'desc'));
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        setAssignments(assignmentsData);

        // Fetch submissions
        const submissionsRef = collection(db, 'submissions');
        const submissionsQuery = query(submissionsRef, orderBy('submittedAt', 'desc'));
        const submissionsSnapshot = await getDocs(submissionsQuery);
        const submissionsData = submissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate()
        }));
        setSubmissions(submissionsData);

        // Fetch courses
        const coursesRef = collection(db, 'courses');
        const coursesQuery = query(coursesRef);
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);

        // Fetch videos
        const videosRef = collection(db, 'videos');
        const videosQuery = query(videosRef, orderBy('uploadDate', 'desc'), limit(5));
        const videosSnapshot = await getDocs(videosQuery);
        const videosData = videosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadDate: doc.data().uploadDate?.toDate()
        }));
        setVideos(videosData);

        // Fetch quizzes
        const quizzesRef = collection(db, 'quizzes');
        const quizzesQuery = query(quizzesRef);
        const quizzesSnapshot = await getDocs(quizzesQuery);
        const quizzesData = quizzesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuizzes(quizzesData);

        // Fetch feeds
        const feedsRef = collection(db, 'feeds');
        const feedsQuery = query(feedsRef, orderBy('createdAt', 'desc'), limit(10));
        const feedsSnapshot = await getDocs(feedsQuery);
        const feedsData = feedsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        setFeeds(feedsData);

        // Generate recent activity from all sources
        const activities = [
          ...submissionsData.slice(0, 5).map(sub => ({
            id: sub.id,
            type: 'submission',
            title: `New submission from ${sub.userName || 'a student'}`,
            description: `Assignment: ${sub.assignmentTitle || 'Unknown assignment'}`,
            timestamp: sub.submittedAt || new Date(),
            icon: <FormOutlined style={{ color: '#722ed1' }} />
          })),
          ...studentsData.filter(s => {
            if (!s.createdAt) return false;
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            return s.createdAt >= twoWeeksAgo;
          }).slice(0, 3).map(student => ({
            id: student.id,
            type: 'student',
            title: `New student joined: ${student.name}`,
            description: `Email: ${student.email}`,
            timestamp: student.createdAt || new Date(),
            icon: <UserOutlined style={{ color: BRAND_COLOR }} />
          })),
          ...videosData.slice(0, 3).map(video => ({
            id: video.id,
            type: 'video',
            title: `New video uploaded: ${video.title || 'Untitled'}`,
            description: `Category: ${video.category || 'Uncategorized'}`,
            timestamp: video.uploadDate || new Date(),
            icon: <PlayCircleOutlined style={{ color: '#fa541c' }} />
          })),
          ...feedsData.slice(0, 3).map(feed => ({
            id: feed.id,
            type: 'feed',
            title: feed.title || 'New announcement',
            description: feed.content?.substring(0, 50) + '...' || 'No content',
            timestamp: feed.createdAt || new Date(),
            icon: <CommentOutlined style={{ color: '#13c2c2' }} />
          }))
        ];
        
        // Sort by date (newest first)
        activities.sort((a, b) => 
          (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
        );
        setRecentActivity(activities);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const newThisWeek = students.filter(student => {
    if (!student.createdAt) return false;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return student.createdAt >= oneWeekAgo;
  }).length;
  
  const totalAssignments = assignments.length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending' || s.status === 'submitted').length;
  const completedSubmissions = submissions.filter(s => s.status === 'approved' || s.status === 'completed').length;
  
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === 'active').length;
  
  const totalVideosCount = videos.length;
  const totalQuizzesCount = quizzes.length;
  const totalFeedsCount = feeds.length;
  
  // Create data for pie charts
  const assignmentsByLanguage = () => {
    const counts = {};
    assignments.forEach(item => {
      const language = item.language || 'Other';
      counts[language] = (counts[language] || 0) + 1;
    });
    
    // Add sample data if none available
    if (Object.keys(counts).length === 0) {
      return [
        { type: 'JavaScript', value: 4 },
        { type: 'React', value: 3 },
        { type: 'HTML/CSS', value: 2 },
        { type: 'Node.js', value: 1 }
      ];
    }
    
    return Object.entries(counts)
      .map(([type, value]) => ({ type, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  const quizzesByLanguage = () => {
    const counts = {};
    quizzes.forEach(item => {
      const language = item.language || 'Other';
      counts[language] = (counts[language] || 0) + 1;
    });
    
    // Add sample data if none available
    if (Object.keys(counts).length === 0) {
      return [
        { type: 'JavaScript', value: 3 },
        { type: 'React', value: 2 },
        { type: 'HTML/CSS', value: 2 },
        { type: 'Node.js', value: 1 }
      ];
    }
    
    return Object.entries(counts)
      .map(([type, value]) => ({ type, value }))
      .sort((a, b) => b.value - a.value);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Header */}
      <Card 
        bordered={false} 
        style={{ 
          borderRadius: 16, 
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          background: 'linear-gradient(120deg, #0067b8 0%, #1e3a8a 100%)',
          marginBottom: 24,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Decorative circles */}
        <div 
          style={{ 
            position: 'absolute', 
            top: -30, 
            right: -30, 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)',
            zIndex: 1
          }} 
        />
        <div 
          style={{ 
            position: 'absolute', 
            bottom: -20, 
            right: 120, 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.07)',
            zIndex: 1
          }} 
        />
        
        <Row gutter={[24, 24]} align="middle" style={{ position: 'relative', zIndex: 2 }}>
          <Col xs={24} md={16}>
            <Space direction="vertical" size={12}>
              <Title level={2} style={{ color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                Welcome back, {currentUser?.displayName || 'Trainer'}!
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16 }}>
                Here's an overview of your training platform statistics
              </Text>
              <div style={{ marginTop: 8 }}>
                <Tag color="blue" style={{ padding: '4px 12px', borderRadius: 16 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Tag>
              </div>
            </Space>
          </Col>
          <Col xs={0} md={8} style={{ textAlign: 'right' }}>
            <div 
              style={{ 
                width: 100, 
                height: 100, 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                border: '4px solid rgba(255,255,255,0.2)'
              }}
            >
              <DashboardOutlined style={{ fontSize: 48, color: 'white' }} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 12, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0, 103, 184, 0.12)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '20px', position: 'relative' }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '5px', 
                height: '100%', 
                background: BRAND_COLOR 
              }} 
            />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                <TeamOutlined style={{ marginRight: 8, color: BRAND_COLOR }} />
                Total Students
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>Enrolled in your platform</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: BRAND_COLOR, lineHeight: 1 }}>
                {totalStudents}
              </span>
              {newThisWeek > 0 && (
                <Tag color="success" style={{ margin: 0, fontWeight: 500 }}>
                  <ArrowUpOutlined /> {newThisWeek} new this week
                </Tag>
              )}
            </div>
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor={BRAND_COLOR}
              style={{ marginTop: 16 }}
              strokeWidth={6}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 12, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(114, 46, 209, 0.12)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '20px', position: 'relative' }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '5px', 
                height: '100%', 
                background: '#722ed1' 
              }} 
            />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                <FormOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                Active Assignments
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>Tasks assigned to students</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#722ed1', lineHeight: 1 }}>
                {totalAssignments}
              </span>
              {pendingSubmissions > 0 && (
                <Tag color="warning" style={{ margin: 0, fontWeight: 500 }}>
                  {pendingSubmissions} pending review
                </Tag>
              )}
            </div>
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor={'#722ed1'}
              style={{ marginTop: 16 }}
              strokeWidth={6}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 12, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(250, 84, 28, 0.12)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '20px', position: 'relative' }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '5px', 
                height: '100%', 
                background: '#fa541c' 
              }} 
            />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                <BookOutlined style={{ marginRight: 8, color: '#fa541c' }} />
                Available Courses
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>Training courses on platform</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#fa541c', lineHeight: 1 }}>
                {totalCourses}
              </span>
              <Tag color="processing" style={{ margin: 0, fontWeight: 500 }}>
                {activeCourses} active courses
              </Tag>
            </div>
            <Progress 
              percent={totalCourses ? Math.round((activeCourses / totalCourses) * 100) : 0} 
              showInfo={false} 
              strokeColor={'#fa541c'}
              style={{ marginTop: 16 }}
              strokeWidth={6}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 12, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(19, 194, 194, 0.12)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '20px', position: 'relative' }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '5px', 
                height: '100%', 
                background: '#13c2c2' 
              }} 
            />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                <PlayCircleOutlined style={{ marginRight: 8, color: '#13c2c2' }} />
                Training Videos
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>Educational content for students</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#13c2c2', lineHeight: 1 }}>
                {totalVideosCount}
              </span>
              <Button size="small" type="primary" style={{ height: 'auto', padding: '2px 8px' }}>
                View All
              </Button>
            </div>
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor={'#13c2c2'}
              style={{ marginTop: 16 }}
              strokeWidth={6}
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 12, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(82, 196, 26, 0.12)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '20px', position: 'relative' }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '5px', 
                height: '100%', 
                background: '#52c41a' 
              }} 
            />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                <QuestionCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Assessment Quizzes
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>Knowledge testing material</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#52c41a', lineHeight: 1 }}>
                {totalQuizzesCount}
              </span>
              <div>
                <Button size="small" type="primary" style={{ height: 'auto', padding: '2px 8px' }}>
                  Create New
                </Button>
              </div>
            </div>
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor={'#52c41a'}
              style={{ marginTop: 16 }}
              strokeWidth={6}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 12, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(250, 173, 20, 0.12)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '20px', position: 'relative' }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '5px', 
                height: '100%', 
                background: '#faad14' 
              }} 
            />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                <CheckCircleTwoTone twoToneColor="#faad14" style={{ marginRight: 8 }} />
                Student Submissions
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>Assignment completion status</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#faad14', lineHeight: 1 }}>
                {completedSubmissions + pendingSubmissions}
              </span>
              <Tag color="success" style={{ margin: 0, fontWeight: 500 }}>
                {completedSubmissions} completed
              </Tag>
            </div>
            <Progress 
              percent={completedSubmissions + pendingSubmissions > 0 ? 
                Math.round((completedSubmissions / (completedSubmissions + pendingSubmissions)) * 100) : 0} 
              showInfo={true}
              format={percent => `${percent}%`}
              strokeColor={'#faad14'}
              style={{ marginTop: 16 }}
              strokeWidth={6}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 12, 
              height: '100%',
              boxShadow: '0 4px 12px rgba(235, 47, 150, 0.12)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '20px', position: 'relative' }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '5px', 
                height: '100%', 
                background: '#eb2f96' 
              }} 
            />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                <CommentOutlined style={{ marginRight: 8, color: '#eb2f96' }} />
                Announcement Posts
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>Communications and updates</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#eb2f96', lineHeight: 1 }}>
                {totalFeedsCount}
              </span>
              <Button size="small" type="primary" style={{ height: 'auto', padding: '2px 8px' }}>
                Post New
              </Button>
            </div>
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor={'#eb2f96'}
              style={{ marginTop: 16 }}
              strokeWidth={6}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for detailed information */}
      <Tabs 
        defaultActiveKey="1" 
        onChange={setActiveTab} 
        className="dashboard-tabs" 
        style={{ marginBottom: 24 }}
        type="card"
      >
        <TabPane 
          tab={
            <span>
              <DashboardOutlined /> Overview
            </span>
          } 
          key="1"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <CodeOutlined style={{ color: BRAND_COLOR }} />
                    <span>Assignments by Language</span>
                  </Space>
                }
                bordered={false}
                style={{ 
                  borderRadius: 12, 
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0, 103, 184, 0.08)'
                }}
                extra={<Text type="secondary">Distribution of programming tasks</Text>}
              >
                {assignmentsByLanguage().length > 0 ? (
                  <Pie
                    data={assignmentsByLanguage()}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    innerRadius={0.6}
                    label={{
                      type: 'inner',
                      offset: '-30%',
                      content: ({ value }) => `${value}`,
                      style: {
                        fontSize: 14,
                        textAlign: 'center',
                      },
                    }}
                    legend={{
                      position: 'bottom',
                    }}
                    interactions={[{ type: 'element-active' }]}
                    style={{ height: 300 }}
                  />
                ) : (
                  <>
                    <Empty 
                      description="No assignments data available" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      style={{ margin: '20px 0' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <Button type="primary">Create First Assignment</Button>
                    </div>
                  </>
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card 
                title={
                  <Space>
                    <QuestionCircleOutlined style={{ color: '#13c2c2' }} />
                    <span>Quizzes by Language</span>
                  </Space>
                }
                bordered={false}
                style={{ 
                  borderRadius: 12, 
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(19, 194, 194, 0.08)'
                }}
                extra={<Text type="secondary">Distribution of assessment content</Text>}
              >
                {quizzesByLanguage().length > 0 ? (
                  <Pie
                    data={quizzesByLanguage()}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    innerRadius={0.6}
                    label={{
                      type: 'inner',
                      offset: '-30%',
                      content: ({ value }) => `${value}`,
                      style: {
                        fontSize: 14,
                        textAlign: 'center',
                      },
                    }}
                    legend={{
                      position: 'bottom',
                    }}
                    interactions={[{ type: 'element-active' }]}
                    style={{ height: 300 }}
                  />
                ) : (
                  <>
                    <Empty 
                      description="No quizzes data available" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      style={{ margin: '20px 0' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <Button type="primary">Create First Quiz</Button>
                    </div>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane 
          tab={
            <span>
              <BellOutlined /> Recent Activity
            </span>
          } 
          key="2"
        >
          <Card 
            bordered={false}
            style={{ borderRadius: 12 }}
          >
            {recentActivity.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={recentActivity}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar icon={item.icon} />
                      }
                      title={item.title}
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">{item.description}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.timestamp ? formatDate(item.timestamp) : 'Unknown date'}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <>
                <Empty 
                  description={
                    <span>
                      No recent activity found<br/>
                      <small style={{ color: '#888' }}>New student activities will appear here</small>
                    </span>
                  } 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ margin: '40px 0' }}
                />
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <Button type="primary">Create New Activity</Button>
                </div>
              </>
            )}
          </Card>
        </TabPane>
        <TabPane 
          tab={
            <span>
              <TeamOutlined /> Students
            </span>
          } 
          key="3"
        >
          <Card 
            bordered={false}
            style={{ borderRadius: 12 }}
          >
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>Student List</Title>
              <Text type="secondary">All registered students ({students.length})</Text>
            </div>
            <Table
              dataSource={students}
              rowKey="id"
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, student) => (
                    <Space>
                      <Avatar
                        src={student.photoURL}
                        icon={!student.photoURL && <UserOutlined />}
                        style={{ backgroundColor: !student.photoURL ? BRAND_COLOR : undefined }}
                      >
                        {!student.photoURL && (student.name?.charAt(0).toUpperCase() || '')}
                      </Avatar>
                      <span>{text}</span>
                    </Space>
                  ),
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email',
                },
                {
                  title: 'Joined Date',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  render: (date) => formatDate(date),
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={status === 'active' ? 'success' : 'default'}>
                      {status || 'Active'}
                    </Tag>
                  ),
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: () => (
                    <Button type="primary" size="small">View Details</Button>
                  ),
                }
              ]}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}