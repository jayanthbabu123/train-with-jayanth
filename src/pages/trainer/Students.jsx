import { useState, useEffect, useLayoutEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
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
  Statistic,
  message,
  Select,
  Form,
  Input
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
  const [modalVisible, setModalVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [form] = Form.useForm();
  const [studentStats, setStudentStats] = useState({
    totalAssignments: 0,
    completedAssignments: 0,
    submissions: []
  });
  const { currentUser } = useAuth();
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const fetchStudentStats = async (studentId) => {
    try {
      // Fetch total assignments
      const assignmentsQuery = query(collection(db, 'assignments'));
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const totalAssignments = assignmentsSnapshot.size;

      // Fetch student's submissions
      const submissionsQuery = query(
        collection(db, 'submissions'),
        where('userId', '==', studentId)
      );
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const submissions = submissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStudentStats({
        totalAssignments,
        completedAssignments: submissions.length,
        submissions
      });
    } catch (error) {
      console.error('Error fetching student stats:', error);
    }
  };

  const handleViewDetails = async (student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
    await fetchStudentStats(student.id);
  };

  const handleAssignBatch = (student) => {
    setSelectedStudent(student);
    form.setFieldsValue({
      batchId: student.batchId || '',
      batchName: student.batchName || ''
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const studentRef = doc(db, 'users', selectedStudent.id);
      await updateDoc(studentRef, {
        batchId: values.batchId,
        batchName: values.batchName
      });

      message.success('Batch assigned successfully');
      setModalVisible(false);
      fetchStudents(); // Refresh the list
    } catch (error) {
      message.error('Failed to assign batch');
      console.error('Error:', error);
    }
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
      title: 'Batch',
      key: 'batch',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.batchId ? (
            <>
              <Tag color="blue" icon={<TeamOutlined />}>
                {record.batchName}
              </Tag>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ID: {record.batchId}
              </Text>
            </>
          ) : (
            <Tag color="default">Not Assigned</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, student) => (
        <Space direction={windowWidth >= 768 ? 'horizontal' : 'vertical'} size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(student)}
            style={{ 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: windowWidth >= 768 ? '14px' : '12px',
              padding: windowWidth >= 768 ? '4px 15px' : '0 8px',
              height: windowWidth >= 768 ? '32px' : '28px'
            }}
          >
            {windowWidth >= 576 ? 'View Details' : 'View'}
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleAssignBatch(student)}
            style={{ 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: windowWidth >= 768 ? '14px' : '12px',
              padding: windowWidth >= 768 ? '4px 15px' : '0 8px',
              height: windowWidth >= 768 ? '32px' : '28px'
            }}
          >
            {windowWidth >= 576 ? 'Assign Batch' : 'Assign'}
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
    <div style={{ padding: windowWidth >= 768 ? '24px' : '0' }}>
      <Card 
        bordered={false} 
        style={{ 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          background: '#fff',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <PageHeader
          title="Student Management"
          subtitle="View and manage all your students"
        />

        <div className="table-responsive" style={{ width: '100%', overflow: 'auto' }}>
          <Table
            dataSource={students}
            columns={columns}
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: windowWidth >= 768,
              showTotal: (total) => `Total ${total} students`,
              responsive: true,
              size: windowWidth >= 768 ? 'default' : 'small'
            }}
            scroll={{ x: 'max-content' }}
            style={{ width: '100%' }}
            size={windowWidth >= 768 ? 'default' : 'small'}
          />
        </div>
      </Card>

      {/* Student Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar
              size={windowWidth >= 576 ? 40 : 32}
              src={selectedStudent?.photoURL || `https://ui-avatars.com/api/?name=${selectedStudent?.name}&background=${BRAND_COLOR.replace('#', '')}&color=fff`}
              icon={!selectedStudent?.photoURL && <UserOutlined />}
              style={{ 
                backgroundColor: !selectedStudent?.photoURL ? BRAND_COLOR : undefined,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <div>
              <Title level={windowWidth >= 576 ? 4 : 5} style={{ margin: 0 }}>{selectedStudent?.name}</Title>
              <Text type="secondary" style={{ fontSize: windowWidth >= 576 ? '14px' : '12px' }}>{selectedStudent?.email}</Text>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={windowWidth >= 768 ? 800 : '95%'}
        style={{ top: 20 }}
      >
        {selectedStudent && (
          <>
            <Row gutter={[windowWidth >= 768 ? 24 : 12, windowWidth >= 768 ? 24 : 12]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={24} md={8}>
                <Card>
                  <Statistic
                    title="Total Assignments"
                    value={studentStats.totalAssignments}
                    prefix={<BookOutlined />}
                    valueStyle={{ color: BRAND_COLOR }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Card>
                  <Statistic
                    title="Completed Assignments"
                    value={studentStats.completedAssignments}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: BRAND_COLOR }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Card>
                  <Statistic
                    title="Completion Rate"
                    value={studentStats.totalAssignments ? 
                      Math.round((studentStats.completedAssignments / studentStats.totalAssignments) * 100) : 0}
                    suffix="%"
                    prefix={<CheckCircleTwoTone twoToneColor="#52c41a" />}
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
              <Descriptions.Item label="Batch" span={3}>
                {selectedStudent.batchId ? (
                  <Space direction="vertical" size="small">
                    <Tag color="blue" icon={<TeamOutlined />}>
                      {selectedStudent.batchName}
                    </Tag>
                    <Text type="secondary">
                      Batch ID: {selectedStudent.batchId}
                    </Text>
                  </Space>
                ) : (
                  <Tag color="default">Not Assigned</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Recent Submissions</Title>
            <div className="table-responsive" style={{ width: '100%', overflow: 'auto' }}>
              <Table
                dataSource={studentStats.submissions}
                columns={[
                {
                  title: 'Assignment',
                  dataIndex: 'assignmentTitle',
                  key: 'assignmentTitle',
                },
                {
                  title: 'Submitted At',
                  dataIndex: 'submittedAt',
                  key: 'submittedAt',
                  render: (date) => formatDate(date?.toDate()),
                },
                {
                  title: 'Language',
                  dataIndex: 'language',
                  key: 'language',
                  render: (language) => {
                    const languageColors = {
                      javascript: { color: '#f7df1e', name: 'JavaScript' },
                      python: { color: '#3776ab', name: 'Python' },
                      java: { color: '#007396', name: 'Java' },
                      cpp: { color: '#00599c', name: 'C++' },
                      csharp: { color: '#239120', name: 'C#' },
                      typescript: { color: '#3178c6', name: 'TypeScript' },
                      go: { color: '#00add8', name: 'Go' },
                      ruby: { color: '#cc342d', name: 'Ruby' },
                      php: { color: '#777bb4', name: 'PHP' },
                      html: { color: '#e34f26', name: 'HTML' },
                      css: { color: '#1572b6', name: 'CSS' },
                      rust: { color: '#dea584', name: 'Rust' },
                      swift: { color: '#fa7343', name: 'Swift' },
                      kotlin: { color: '#7f52ff', name: 'Kotlin' }
                    };
                    return (
                      <Tag color={languageColors[language]?.color || 'default'}>
                        {languageColors[language]?.name || language}
                      </Tag>
                    );
                  },
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, submission) => (
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        // TODO: Implement view submission code feature
                        message.info('View submission code feature coming soon');
                      }}
                    >
                      View Code
                    </Button>
                  ),
                },
                ]}
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
              />
            </div>
          </>
        )}
      </Modal>

      <Modal
        title="Assign Batch"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="batchId"
            label="Batch ID"
            rules={[{ required: true, message: 'Please enter batch ID' }]}
          >
            <Input placeholder="Enter batch ID" />
          </Form.Item>
          <Form.Item
            name="batchName"
            label="Batch Name"
            rules={[{ required: true, message: 'Please enter batch name' }]}
          >
            <Input placeholder="Enter batch name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Assign Batch
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 