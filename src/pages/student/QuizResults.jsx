import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  Typography,
  Space,
  Button,
  Spin,
  Result,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  Timeline
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function QuizResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    fetchQuizAndAttempt();
  }, [id]);

  const fetchQuizAndAttempt = async () => {
    try {
      // Fetch quiz
      const quizRef = doc(db, 'quizzes', id);
      const quizSnap = await getDoc(quizRef);
      if (!quizSnap.exists()) {
        navigate('/student/quizzes');
        return;
      }
      setQuiz(quizSnap.data());

      // Fetch attempt
      const attemptRef = doc(db, 'quiz_submissions', `${id}_${currentUser.uid}`);
      const attemptSnap = await getDoc(attemptRef);
      if (!attemptSnap.exists()) {
        navigate('/student/quizzes');
        return;
      }
      setAttempt(attemptSnap.data());
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quiz || !attempt) {
    return null;
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/student/quizzes')}
        style={{ marginBottom: 24 }}
      >
        Back to Quizzes
      </Button>

      <Result
        icon={attempt.score >= (quiz.passingScore || 70) ? <TrophyOutlined style={{ color: '#52c41a' }} /> : <TrophyOutlined style={{ color: '#faad14' }} />}
        status={attempt.score >= (quiz.passingScore || 70) ? "success" : "warning"}
        title={`Quiz ${attempt.score >= (quiz.passingScore || 70) ? 'Completed Successfully!' : 'Completed'}`}
        subTitle={`You scored ${attempt.score.toFixed(1)}%`}
      >
        <div style={{ marginTop: 40 }}>
          <Row gutter={[32, 32]}>
            <Col span={8}>
              <Statistic
                title="Correct Answers"
                value={attempt.correctAnswers}
                suffix={`/ ${attempt.totalQuestions}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Time Taken"
                value={formatTime(attempt.timeTaken)}
                suffix="minutes"
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Score"
                value={attempt.score.toFixed(1)}
                suffix="%"
                valueStyle={{ color: attempt.score >= (quiz.passingScore || 70) ? '#52c41a' : '#faad14' }}
              />
            </Col>
          </Row>

          <Divider />

          <div style={{ marginTop: 24 }}>
            <Title level={4}>Question Analysis</Title>
            <Timeline style={{ marginTop: 24 }}>
              {quiz.questions.map((question, index) => {
                const userAnswer = attempt.answers[index];
                const isCorrect = userAnswer === question.answer;
                
                return (
                  <Timeline.Item
                    key={index}
                    color={isCorrect ? 'green' : 'red'}
                    style={{ marginBottom: 32 }}
                  >
                    <Card
                      style={{
                        border: '1px solid',
                        borderColor: isCorrect ? '#b7eb8f' : '#ffccc7',
                        borderRadius: 8
                      }}
                    >
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                          <Text strong style={{ fontSize: 16 }}>Question {index + 1}:</Text>
                          <div style={{ marginTop: 8 }}>{question.question}</div>
                        </div>

                        <div>
                          <Text strong>Your Answer:</Text>
                          <div
                            style={{
                              marginTop: 8,
                              padding: '8px 12px',
                              background: isCorrect ? '#f6ffed' : '#fff2f0',
                              border: '1px solid',
                              borderColor: isCorrect ? '#b7eb8f' : '#ffccc7',
                              borderRadius: 4
                            }}
                          >
                            {question.options[userAnswer]}
                            {isCorrect ? (
                              <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
                            ) : (
                              <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />
                            )}
                          </div>
                        </div>

                        {!isCorrect && (
                          <div>
                            <Text strong>Correct Answer:</Text>
                            <div
                              style={{
                                marginTop: 8,
                                padding: '8px 12px',
                                background: '#f6ffed',
                                border: '1px solid #b7eb8f',
                                borderRadius: 4
                              }}
                            >
                              {question.options[question.answer]}
                              <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: 8 }}>
                          <Tag color={isCorrect ? 'success' : 'error'}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </Tag>
                          <Tag color="blue">Question {index + 1}</Tag>
                        </div>
                      </Space>
                    </Card>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        </div>
      </Result>
    </div>
  );
} 