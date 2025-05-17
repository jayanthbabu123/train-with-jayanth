import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
  Progress
} from 'antd';
import { 
  UserOutlined, 
  CheckCircleTwoTone, 
  ClockCircleTwoTone, 
  UsergroupAddOutlined,
  MailOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function TrainerDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        const studentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() // Convert Firestore timestamp to Date
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Table columns for Ant Design Table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, student) => (
        <Space>
          <Avatar
            src={student.photoURL || `https://ui-avatars.com/api/?name=${student.name}&background=${BRAND_COLOR.replace('#', '')}&color=fff`}
            icon={!student.photoURL && <UserOutlined />}
            style={{ 
              backgroundColor: !student.photoURL ? BRAND_COLOR : undefined,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {!student.photoURL && (student.name?.charAt(0).toUpperCase() || '')}
          </Avatar>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: BRAND_COLOR }} />
          <span>{email}</span>
        </Space>
      ),
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: BRAND_COLOR }} />
          <span>{formatDate(date)}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'active' ? 'green' : 'default'} 
          icon={status === 'active' ? 
            <CheckCircleTwoTone twoToneColor="#52c41a" /> : 
            <ClockCircleTwoTone twoToneColor="#faad14" />
          }
          style={{ 
            fontWeight: 500,
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, student) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {/* TODO: View details */}}
            style={{ 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View Details
          </Button>
          <Button
            type="default"
            onClick={() => {/* TODO: Edit student */}}
            style={{ 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const newThisWeek = students.filter(student => {
    const createdAt = new Date(student.createdAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return createdAt >= oneWeekAgo;
  }).length;

  const activePercentage = totalStudents ? Math.round((activeStudents / totalStudents) * 100) : 0;
  const newPercentage = totalStudents ? Math.round((newThisWeek / totalStudents) * 100) : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card 
        bordered={false} 
        style={{ 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          background: '#fff',
          marginBottom: 24
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0, color: BRAND_COLOR }}>
            Trainer Dashboard
          </Title>
          <Text type="secondary">
            Welcome back, {currentUser?.displayName}
          </Text>
        </div>
      </Card>

      {/* Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card 
            bordered={false}
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              background: '#fff'
            }}
          >
            <Statistic
              title={
                <Space>
                  <UsergroupAddOutlined style={{ color: BRAND_COLOR }} />
                  <span>Total Students</span>
                </Space>
              }
              value={totalStudents}
              valueStyle={{ color: BRAND_COLOR, fontSize: 32, fontWeight: 'bold' }}
            />
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor={BRAND_COLOR}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            bordered={false}
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              background: '#fff'
            }}
          >
            <Statistic
              title={
                <Space>
                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                  <span>Active Students</span>
                </Space>
              }
              value={activeStudents}
              valueStyle={{ color: '#52c41a', fontSize: 32, fontWeight: 'bold' }}
              suffix={`/ ${totalStudents}`}
            />
            <Progress 
              percent={activePercentage} 
              showInfo={false} 
              strokeColor="#52c41a"
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            bordered={false}
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              background: '#fff'
            }}
          >
            <Statistic
              title={
                <Space>
                  <ClockCircleTwoTone twoToneColor="#faad14" />
                  <span>New This Week</span>
                </Space>
              }
              value={newThisWeek}
              valueStyle={{ color: '#faad14', fontSize: 32, fontWeight: 'bold' }}
              suffix={`/ ${totalStudents}`}
            />
            <Progress 
              percent={newPercentage} 
              showInfo={false} 
              strokeColor="#faad14"
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Students Table */}
      <Card 
        bordered={false}
        style={{ 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          background: '#fff'
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: BRAND_COLOR }}>
            Student List
          </Title>
          <Text type="secondary">
            Overview of all registered students
          </Text>
        </div>
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={{ 
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} students`
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
} 