import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  UserOutlined, 
  BookOutlined, 
  CheckCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title } = Typography;

export default function TrainerDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    pendingReviews: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total students
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      const totalStudents = studentsSnapshot.size;

      // Get total assignments
      const assignmentsQuery = query(collection(db, 'assignments'));
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const totalAssignments = assignmentsSnapshot.size;

      // Get total submissions
      const submissionsQuery = query(collection(db, 'submissions'));
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const submissions = submissionsSnapshot.docs.map(doc => doc.data());
      const totalSubmissions = submissions.length;
      const pendingReviews = submissions.filter(s => s.status === 'submitted').length;

      setStats({
        totalStudents,
        totalAssignments,
        totalSubmissions,
        pendingReviews
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            onClick={() => navigate('/trainer/students')}
          >
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            onClick={() => navigate('/trainer/assignments')}
          >
            <Statistic
              title="Total Assignments"
              value={stats.totalAssignments}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            onClick={() => navigate('/trainer/submissions')}
          >
            <Statistic
              title="Total Submissions"
              value={stats.totalSubmissions}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable 
            onClick={() => navigate('/trainer/submissions')}
            style={{ background: stats.pendingReviews > 0 ? '#fffbe6' : 'inherit' }}
          >
            <Statistic
              title="Pending Reviews"
              value={stats.pendingReviews}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: stats.pendingReviews > 0 ? '#faad14' : 'inherit' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
} 