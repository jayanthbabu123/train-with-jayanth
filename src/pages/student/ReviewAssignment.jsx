import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Card, Space, Typography, Button, Rate, Tag, Spin } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import { freeCodeCampDark } from '@codesandbox/sandpack-themes';
import PracticeSandpack from '../../components/student/PracticeSandpack';
import { LANGUAGE_TEMPLATES } from '../../config/languageTemplates';

const { Title, Text } = Typography;

export default function ReviewAssignment() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    if (location.state?.submissionId) {
      fetchSubmission();
    } else {
      message.error('Invalid submission');
      navigate('/student/assignments');
    }
  }, [location.state?.submissionId]);

  const fetchSubmission = async () => {
    try {
      const submissionRef = doc(db, 'submissions', location.state.submissionId);
      const submissionSnap = await getDoc(submissionRef);
      
      if (submissionSnap.exists()) {
        const submissionData = submissionSnap.data();
        setSubmission({
          id: submissionSnap.id,
          ...submissionData,
          submittedAt: submissionData.submittedAt.toDate(),
          reviewedAt: submissionData.reviewedAt?.toDate()
        });
      } else {
        message.error('Submission not found');
        navigate('/student/assignments');
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
      message.error('Failed to fetch submission');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !submission) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const template = LANGUAGE_TEMPLATES[submission.language]?.template || 'react';

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/student/assignments')}
              >
                Back to Assignments
              </Button>
              <Title level={3} style={{ margin: 0 }}>
                Review Assignment
              </Title>
              <Tag color="blue" icon={<EyeOutlined />}>
                Review Mode
              </Tag>
            </Space>
          </div>

          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Assignment:</Text>
                <Text> {submission.assignmentTitle}</Text>
              </div>
              <div>
                <Text strong>Submitted:</Text>
                <Text> {submission.submittedAt.toLocaleString()}</Text>
              </div>
              <div>
                <Text strong>Status:</Text>
                <Tag 
                  color={submission.status === 'submitted' ? 'processing' : 'success'}
                >
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </Tag>
              </div>
            </Space>
          </Card>

          <Card title="Your Submission">
            <SandpackProvider
              template={template}
              files={submission.code}
              theme={freeCodeCampDark}
              options={{
                recompileMode: "delayed",
                recompileDelay: 1000,
                editorHeight: 600,
                editorWidthPercentage: 60,
                activeFile: Object.keys(submission.code)[0] || "/index.html",
                visibleFiles: Object.keys(submission.code) || ["/index.html", "/index.js"],
              }}
            >
              <PracticeSandpack
                files={submission.code}
                readOnly={true}
                showConsole={true}
                template={template}
              />
            </SandpackProvider>
          </Card>

          {submission.status === 'reviewed' && (
            <Card title="Trainer's Feedback">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Text strong>Rating:</Text>
                  <Rate 
                    value={submission.rating} 
                    disabled
                    style={{ marginLeft: 16 }}
                  />
                </div>
                <div>
                  <Text strong>Comments:</Text>
                  <Card 
                    style={{ 
                      marginTop: 8,
                      background: '#f5f5f5',
                      border: '1px solid #e8e8e8'
                    }}
                  >
                    <Text>{submission.feedback || 'No feedback provided.'}</Text>
                  </Card>
                </div>
                <div>
                  <Text type="secondary">
                    Reviewed on: {submission.reviewedAt?.toLocaleString()}
                  </Text>
                </div>
              </Space>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
} 