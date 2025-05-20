import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
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
  const [form] = Form.useForm();
  const [studentStats, setStudentStats] = useState({
    totalAssignments: 0,
    completedAssignments: 0,
    submissions: []
  });
  const { currentUser } = useAuth();

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
            onClick={() => handleAssignBatch(student)}
            style={{ 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Assign Batch
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
                    title="Total Assignments"
                    value={studentStats.totalAssignments}
                    prefix={<BookOutlined />}
                    valueStyle={{ color: BRAND_COLOR }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Completed Assignments"
                    value={studentStats.completedAssignments}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: BRAND_COLOR }}
                  />
                </Card>
              </Col>
              <Col span={8}>
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
                  render: (language) => (
                    <Tag color={LANGUAGE_TEMPLATES[language]?.color}>
                      {LANGUAGE_TEMPLATES[language]?.name}
                    </Tag>
                  ),
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
            />
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