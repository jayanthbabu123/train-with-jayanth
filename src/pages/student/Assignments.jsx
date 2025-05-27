import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LANGUAGE_TEMPLATES } from '../../config/languageTemplates';
import PageHeader from '../../components/common/PageHeader';
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
  Modal,
  Select
} from 'antd';
import {
  PlayCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CodeOutlined,
  FileTextOutlined,
  ReadOutlined,
  BarChartOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    language: null,
    topic: null,
    level: null
  });
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
      dataIndex: ['metadata', 'language'],
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
      title: 'Topic',
      dataIndex: ['metadata', 'topic'],
      key: 'topic',
      render: (topic) => (
        <Tag color="blue">{topic}</Tag>
      ),
    },
    {
      title: 'Level',
      dataIndex: ['metadata', 'level'],
      key: 'level',
      render: (level) => {
        const levelConfig = {
          beginner: { color: 'green', label: 'Beginner' },
          intermediate: { color: 'blue', label: 'Intermediate' },
          advanced: { color: 'red', label: 'Advanced' }
        };
        const config = levelConfig[level] || { color: 'default', label: level };
        return (
          <Tag color={config.color}>{config.label}</Tag>
        );
      }
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
      render: (_, record) => (
        <Space>
          {record.submission ? (
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/student/review/${record.id}`, {
                state: { submissionId: `${record.id}_${currentUser.uid}` }
              })}
            >
              Review
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => navigate(`/student/practice/${record.id}`)}
            >
              Start
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab !== 'all' && assignment.metadata?.language !== activeTab) {
      return false;
    }
    if (filters.language && assignment.metadata?.language !== filters.language) {
      return false;
    }
    if (filters.topic && assignment.metadata?.topic !== filters.topic) {
      return false;
    }
    if (filters.level && assignment.metadata?.level !== filters.level) {
      return false;
    }
    return true;
  });

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
        <PageHeader
          title="Assignments"
          subtitle="Complete your programming assignments"
        />

        <div style={{ marginBottom: 24 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'all', label: 'All Assignments' },
              ...Object.entries(LANGUAGE_TEMPLATES).map(([key, lang]) => ({
                key,
                label: (
                  <Space>
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </Space>
                )
              }))
            ]}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Select
              placeholder="Filter by Language"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, language: value }))}
            >
              {Object.entries(LANGUAGE_TEMPLATES).map(([key, lang]) => (
                <Select.Option key={key} value={key}>
                  <Space>
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Filter by Topic"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, topic: value }))}
            >
              {Array.from(new Set(assignments.map(a => a.metadata?.topic).filter(Boolean))).map(topic => (
                <Select.Option key={topic} value={topic}>{topic}</Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Filter by Level"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, level: value }))}
            >
              <Select.Option value="beginner">
                <Tag color="green">Beginner</Tag>
              </Select.Option>
              <Select.Option value="intermediate">
                <Tag color="blue">Intermediate</Tag>
              </Select.Option>
              <Select.Option value="advanced">
                <Tag color="red">Advanced</Tag>
              </Select.Option>
            </Select>
          </Space>
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