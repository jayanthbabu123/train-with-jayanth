import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LANGUAGE_TEMPLATES } from '../../config/languageTemplates';
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Typography, 
  message,
  Tabs,
  Row,
  Col,
  Tooltip,
  Modal
} from 'antd';
import {
  PlayCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CodeOutlined,
  FileTextOutlined,
  ReadOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      // Fetch all assignments
      const q = query(collection(db, 'assignments'));
      const querySnapshot = await getDocs(q);
      const assignmentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch submissions for current user
      const submissionsQuery = query(
        collection(db, 'submissions'),
        where('userId', '==', currentUser.uid)
      );
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const submissions = submissionsSnapshot.docs.map(doc => doc.data());

      // Map submissions to assignments
      const assignmentsWithStatus = assignmentsList.map(assignment => {
        const submission = submissions.find(s => s.assignmentId === assignment.id);
        return {
          ...assignment,
          submission
        };
      });

      setAssignments(assignmentsWithStatus);
    } catch (error) {
      message.error('Failed to fetch assignments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = (assignment) => {
    if (assignment.submission) {
      // If there's a submission, navigate to review mode
      navigate(`/student/practice/${assignment.id}`, { 
        state: { 
          mode: 'review'
        }
      });
    } else {
      // If no submission, navigate to practice mode
      navigate(`/student/practice/${assignment.id}`);
    }
  };

  const getFilteredAssignments = (filter) => {
    switch (filter) {
      case 'pending':
        return assignments.filter(a => !a.submission);
      case 'completed':
        return assignments.filter(a => a.submission);
      default:
        return assignments;
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <CodeOutlined style={{ color: LANGUAGE_TEMPLATES[record.language]?.color }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (language) => (
        <Tag 
          color={LANGUAGE_TEMPLATES[language]?.color} 
          style={{ 
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 500
          }}
        >
          {LANGUAGE_TEMPLATES[language]?.icon} {LANGUAGE_TEMPLATES[language]?.name}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (
        <Space>
          <ClockCircleOutlined />
          <span>{new Date(date).toLocaleDateString()}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const submission = record.submission;
        return (
          <Tag 
            color={submission ? 'success' : 'warning'}
            icon={submission ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            style={{ 
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 500
            }}
          >
            {submission ? 'Completed' : 'Pending'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const submission = record.submission;
        return (
        <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartPractice(record)}
              style={{ 
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {submission ? 'Review' : 'Start Practice'}
            </Button>
        </Space>
        );
      },
    },
  ];

  const filteredAssignments = getFilteredAssignments(activeTab);

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
        <div style={{ 
          marginBottom: 24, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start' 
        }}>
          <div>
            <Title level={2} style={{ margin: 0, color: BRAND_COLOR }}>
              My Assignments
            </Title>
            <Text type="secondary">
              Practice and complete your assignments
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
              <ReadOutlined style={{ fontSize: 20 }} />
              <Text strong>{assignments.length} Total Assignments</Text>
            </Space>
          </Card>
        </div>

        <div style={{ marginBottom: 24 }}>
      <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { 
                key: 'all', 
                label: (
                  <Space>
                    <FileTextOutlined />
                    All Assignments
                  </Space>
                )
              },
              { 
                key: 'pending', 
                label: (
                  <Space>
                    <ClockCircleOutlined />
                    Pending
                  </Space>
                )
              },
              { 
                key: 'completed', 
                label: (
                  <Space>
                    <CheckCircleOutlined />
                    Completed
                  </Space>
                )
              }
            ]}
          />
        </div>

        <Table
          dataSource={filteredAssignments}
          columns={columns}
          rowKey="id"
          pagination={{ 
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} assignments`
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}