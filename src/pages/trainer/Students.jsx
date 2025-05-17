import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { 
  Table, 
  Avatar, 
  Tag, 
  Button, 
  Spin, 
  Space, 
  Card, 
  Modal, 
  Typography, 
  Row, 
  Col,
  Descriptions,
  Divider,
  Statistic
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  EyeOutlined, 
  CheckCircleTwoTone,
  MailOutlined,
  CalendarOutlined,
  TeamOutlined,
  BookOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function TrainerStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        const studentList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() // Convert Firestore timestamp to Date
        }));
        setStudents(studentList);
      } catch (error) {
        toast.error('Failed to fetch students');
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} 
          style={{ 
            fontWeight: 500,
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
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
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(student)}
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
            icon={<EditOutlined />}
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        bordered={false} 
        style={{ 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          background: '#fff'
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, color: BRAND_COLOR }}>
            Student Management
          </Title>
          <Text type="secondary">
            View and manage all your students
          </Text>
        </div>

        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} students`
          }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Student Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar
              size={40}
              src={selectedStudent?.photoURL || `https://ui-avatars.com/api/?name=${selectedStudent?.name}&background=${BRAND_COLOR.replace('#', '')}&color=fff`}
              icon={!selectedStudent?.photoURL && <UserOutlined />}
              style={{ 
                backgroundColor: !selectedStudent?.photoURL ? BRAND_COLOR : undefined,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>{selectedStudent?.name}</Title>
              <Text type="secondary">{selectedStudent?.email}</Text>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        {selectedStudent && (
          <>
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Courses Enrolled"
                    value={5}
                    prefix={<BookOutlined />}
                    valueStyle={{ color: BRAND_COLOR }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Assignments Completed"
                    value={12}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: BRAND_COLOR }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Batch"
                    value="2024A"
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: BRAND_COLOR }}
                  />
                </Card>
              </Col>
            </Row>

            <Divider />

            <Descriptions title="Student Information" bordered>
              <Descriptions.Item label="Full Name" span={3}>
                {selectedStudent.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {selectedStudent.email}
              </Descriptions.Item>
              <Descriptions.Item label="Joined Date" span={3}>
                {formatDate(selectedStudent.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                <Tag 
                  color={selectedStudent.status === 'active' ? 'green' : 'default'}
                  icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                >
                  {selectedStudent.status ? selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1) : 'Active'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
} 