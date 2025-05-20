import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Card, Space, Typography, Button, message, Rate, Input } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import { freeCodeCampDark } from '@codesandbox/sandpack-themes';
import PracticeSandpack from '../../components/student/PracticeSandpack';
import { LANGUAGE_TEMPLATES } from '../../config/languageTemplates';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ReviewSubmission() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (location.state?.submissionId) {
      fetchSubmission();
    } else {
      message.error('Invalid submission');
      navigate('/trainer/submissions');
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
          submittedAt: submissionData.submittedAt.toDate()
        });
        setFeedback(submissionData.feedback || '');
        setRating(submissionData.rating || 0);
      } else {
        message.error('Submission not found');
        navigate('/trainer/submissions');
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
      message.error('Failed to fetch submission');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const submissionRef = doc(db, 'submissions', submission.id);
      await updateDoc(submissionRef, {
        feedback,
        rating,
        status: 'reviewed',
        reviewedAt: new Date()
      });

      message.success('Review submitted successfully');
      navigate('/trainer/submissions');
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error('Failed to submit review');
    }
  };

  if (loading || !submission) {
    return null;
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
                onClick={() => navigate('/trainer/submissions')}
              >
                Back to Submissions
              </Button>
              <Title level={3} style={{ margin: 0 }}>
                Review Submission
              </Title>
            </Space>
          </div>

          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Student:</Text>
                <Text> {submission.userName} ({submission.userEmail})</Text>
              </div>
              <div>
                <Text strong>Assignment:</Text>
                <Text> {submission.assignmentTitle}</Text>
              </div>
              <div>
                <Text strong>Batch:</Text>
                <Text> {submission.batchName}</Text>
              </div>
              <div>
                <Text strong>Submitted:</Text>
                <Text> {submission.submittedAt.toLocaleString()}</Text>
              </div>
            </Space>
          </Card>

          <Card title="Code Review">
            <SandpackProvider
              template={template}
              files={submission.code}
              theme={freeCodeCampDark}
            >
              <PracticeSandpack
                files={submission.code}
                readOnly={true}
                showConsole={true}
              />
            </SandpackProvider>
          </Card>

          <Card title="Feedback">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Rating:</Text>
                <Rate 
                  value={rating} 
                  onChange={setRating}
                  style={{ marginLeft: 16 }}
                />
              </div>
              <div>
                <Text strong>Comments:</Text>
                <TextArea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  style={{ marginTop: 8 }}
                  placeholder="Enter your feedback here..."
                />
              </div>
              <Button 
                type="primary" 
                onClick={handleSubmitReview}
                style={{ alignSelf: 'flex-end' }}
              >
                Submit Review
              </Button>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
} 