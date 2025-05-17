import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import PracticeLayout from '../../components/student/PracticeLayout';
import ProblemStatement from '../../components/student/ProblemStatement';
import PracticeSandpack from '../../components/student/PracticeSandpack';
import { Tabs, Card, Button, Tag, Spin, Typography, Row, Col, Space, Divider } from 'antd';
import {
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  ReadOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  LeftOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const getDifficultyTag = (difficulty) => {
  const colors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error'
  };
  return (
    <Tag color={colors[difficulty]} style={{ borderRadius: 12, padding: '4px 8px' }}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Tag>
  );
};

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const q = query(collection(db, 'assignments'));
      const querySnapshot = await getDocs(q);
      const assignmentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignments(assignmentList);
    } catch (error) {
      toast.error('Failed to fetch assignments');
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAssignments = (filter) => {
    switch (filter) {
      case 'pending':
        return assignments.filter(a => !a.submitted);
      case 'completed':
        return assignments.filter(a => a.submitted);
      default:
        return assignments;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (selectedAssignment) {
    return (
      <div style={{ height: '100vh' }}>
        <div className="d-flex align-items-center justify-content-between p-3 bg-white border-bottom">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => setSelectedAssignment(null)}
          >
            Back to Assignments
          </Button>
          <Title level={4} style={{ margin: 0 }}>{selectedAssignment.title}</Title>
        </div>
        <PracticeLayout>
          <ProblemStatement markdown={selectedAssignment.problemStatement} />
          <PracticeSandpack starterCode={selectedAssignment.sampleCode} />
        </PracticeLayout>
      </div>
    );
  }

  const items = [
    {
      key: 'all',
      label: (
        <Space>
          <FileTextOutlined />
          All Assignments
        </Space>
      ),
      children: (
        <div className="mt-3">
          {getFilteredAssignments('all').map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onSelect={setSelectedAssignment}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'pending',
      label: (
        <Space>
          <ClockCircleOutlined />
          Pending
        </Space>
      ),
      children: (
        <div className="mt-3">
          {getFilteredAssignments('pending').map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onSelect={setSelectedAssignment}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'completed',
      label: (
        <Space>
          <CheckCircleOutlined />
          Completed
        </Space>
      ),
      children: (
        <div className="mt-3">
          {getFilteredAssignments('completed').map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onSelect={setSelectedAssignment}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={2} style={{ margin: 0, color: '#222' }}>My Assignments</Title>
          <Text type="secondary">Track and manage your learning progress</Text>
        </Col>
        <Col>
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
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="all"
        items={items}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 8px #f0f1f2',
        }}
      />
    </div>
  );
}

function AssignmentCard({ assignment, onSelect }) {
  return (
    <Card
      className="mb-3"
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px #f0f1f2',
        transition: 'all 0.3s',
      }}
      bodyStyle={{ padding: '8px' }}
      hoverable
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={18}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space align="start">
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e3a8a 100%)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOutlined style={{ fontSize: 20, color: '#fff' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontSize: '18px' }}>{assignment.title}</Title>
                <Space size={8} className="mt-1">
                  {getDifficultyTag(assignment.difficulty)}
                  <Tag
                    color={assignment.submitted ? 'success' : 'warning'}
                    style={{ borderRadius: 12, padding: '4px 8px' }}
                  >
                    {assignment.submitted ? 'Completed' : 'Pending'}
                  </Tag>
                </Space>
              </div>
            </Space>

            <Text type="secondary" style={{ marginLeft: 56 }}>{assignment.description}</Text>

            <Space size={24} style={{ marginLeft: 56 }}>
              <Space>
                <CalendarOutlined />
                <Text type="secondary">Due: {new Date(assignment.dueDate).toLocaleDateString()}</Text>
              </Space>
              {assignment.submitted && (
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text type="secondary">
                    Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}
                  </Text>
                </Space>
              )}
            </Space>
          </Space>
        </Col>
        <Col xs={24} md={6} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => onSelect(assignment)}
            size="middle"
            style={{
              borderRadius: 6,
              height: 36,
              padding: '0 16px',
            }}
          >
            {assignment.submitted ? 'Review' : 'Start'}
            <ArrowRightOutlined />
          </Button>
        </Col>
      </Row>
    </Card>
  );
}