import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Card, Table, Tag, Space, Typography, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { LANGUAGE_TEMPLATES } from '../../config/languageTemplates';

const { Title, Text } = Typography;

export default function Submissions() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const submissionsQuery = query(
        collection(db, 'submissions'),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(submissionsQuery);
      
      const submissionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt.toDate()
      }));

      setSubmissions(submissionsList);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      message.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (submission) => {
    navigate(`/trainer/review/${submission.assignmentId}`, {
      state: {
        submissionId: submission.id,
        studentId: submission.userId
      }
    });
  };

  const showSubmissionDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          <Text type="secondary">({record.userEmail})</Text>
        </Space>
      ),
    },
    {
      title: 'Assignment',
      dataIndex: 'assignmentTitle',
      key: 'assignmentTitle',
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          <Tag color={LANGUAGE_TEMPLATES[record.language]?.color}>
            {LANGUAGE_TEMPLATES[record.language]?.name}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Batch',
      dataIndex: 'batchName',
      key: 'batchName',
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{date.toLocaleString()}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag 
          color={record.status === 'submitted' ? 'processing' : 'success'}
          icon={record.status === 'submitted' ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
        >
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showSubmissionDetails(record)}
          >
            View Details
          </Button>
          <Button
            type="primary"
            onClick={() => handleReview(record)}
          >
            Review
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Submissions
              </Title>
              <Text type="secondary">
                Review and manage student submissions
              </Text>
            </div>
            <Card
              bordered={false}
              style={{
                background: '#f5f6fa',
                borderRadius: 12,
              }}
            >
              <Space>
                <CheckCircleOutlined style={{ fontSize: 20 }} />
                <Text strong>{submissions.length} Total Submissions</Text>
              </Space>
            </Card>
          </div>

          <Table
            dataSource={submissions}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} submissions`
            }}
          />
        </Space>
      </Card>

      <Modal
        title="Submission Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="review" 
            type="primary" 
            onClick={() => {
              setIsModalVisible(false);
              handleReview(selectedSubmission);
            }}
          >
            Review Submission
          </Button>
        ]}
        width={800}
      >
        {selectedSubmission && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong>Student:</Text>
              <Text> {selectedSubmission.userName} ({selectedSubmission.userEmail})</Text>
            </div>
            <div>
              <Text strong>Assignment:</Text>
              <Text> {selectedSubmission.assignmentTitle}</Text>
            </div>
            <div>
              <Text strong>Batch:</Text>
              <Text> {selectedSubmission.batchName}</Text>
            </div>
            <div>
              <Text strong>Language:</Text>
              <Text> {LANGUAGE_TEMPLATES[selectedSubmission.language]?.name}</Text>
            </div>
            <div>
              <Text strong>Submitted:</Text>
              <Text> {selectedSubmission.submittedAt.toLocaleString()}</Text>
            </div>
            <div>
              <Text strong>Status:</Text>
              <Tag 
                color={selectedSubmission.status === 'submitted' ? 'processing' : 'success'}
                icon={selectedSubmission.status === 'submitted' ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
              >
                {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
              </Tag>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
} 