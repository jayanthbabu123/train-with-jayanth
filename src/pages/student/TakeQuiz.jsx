import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  Typography,
  Space,
  Button,
  Radio,
  Progress,
  Spin,
  message,
  Modal,
  Result,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  Tooltip
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previousAttempt, setPreviousAttempt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
    checkPreviousAttempt();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, quizCompleted]);

  const fetchQuiz = async () => {
    try {
      const quizRef = doc(db, 'quizzes', id);
      const quizSnap = await getDoc(quizRef);
      
      if (quizSnap.exists()) {
        setQuiz(quizSnap.data());
        // Initialize answers object
        const initialAnswers = {};
        quizSnap.data().questions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
      } else {
        message.error('Quiz not found');
        navigate('/student/quizzes');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      message.error('Failed to fetch quiz');
    } finally {
      setLoading(false);
    }
  };

  const checkPreviousAttempt = async () => {
    try {
      const submissionRef = doc(db, 'quiz_submissions', `${id}_${currentUser.uid}`);
      const submissionSnap = await getDoc(submissionRef);
      if (submissionSnap.exists()) {
        setPreviousAttempt(submissionSnap.data());
      }
    } catch (error) {
      console.error('Error checking previous attempt:', error);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Calculate score
      const correctAnswers = quiz.questions.filter(
        (q, index) => q.correctAnswer === answers[index]
      ).length;
      const score = (correctAnswers / quiz.questions.length) * 100;
      
      // Save attempt to Firestore
      const attemptRef = doc(collection(db, 'quizAttempts'));
      await setDoc(attemptRef, {
        quizId: id,
        userId: currentUser.uid,
        score,
        answers,
        timeTaken: 15 * 60 - timeLeft, // Time taken in seconds
        submittedAt: serverTimestamp(),
        status: score >= quiz.passingScore ? 'passed' : 'failed',
        totalQuestions: quiz.questions.length,
        correctAnswers,
        quizTitle: quiz.title,
        quizTopic: quiz.topic,
        quizLevel: quiz.level
      });

      // Get or create student document
      const studentRef = doc(db, 'students', currentUser.uid);
      const studentDoc = await getDoc(studentRef);
      
      if (!studentDoc.exists()) {
        // Create new student document if it doesn't exist
        await setDoc(studentRef, {
          userId: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          role: 'student',
          createdAt: serverTimestamp(),
          quizStatus: {
            [id]: {
              status: score >= quiz.passingScore ? 'passed' : 'failed',
              lastAttempt: serverTimestamp(),
              score,
              attemptNumber: 1
            }
          }
        });
      } else {
        // Update existing student document
        await updateDoc(studentRef, {
          [`quizStatus.${id}`]: {
            status: score >= quiz.passingScore ? 'passed' : 'failed',
            lastAttempt: serverTimestamp(),
            score,
            attemptNumber: (studentDoc.data().quizStatus?.[id]?.attemptNumber || 0) + 1
          }
        });
      }

      setScore(score);
      setQuizCompleted(true);
      setShowResults(true);
      navigate(`/student/quiz-results/${id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      message.error('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        message.error('Error attempting to enable fullscreen mode');
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  if (showResults) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
        <Result
          icon={score >= (quiz.passingScore || 70) ? <TrophyOutlined style={{ color: '#52c41a' }} /> : <QuestionCircleOutlined style={{ color: '#faad14' }} />}
          status={score >= (quiz.passingScore || 70) ? "success" : "warning"}
          title={`Quiz ${score >= (quiz.passingScore || 70) ? 'Completed Successfully!' : 'Completed'}`}
          subTitle={`You scored ${score.toFixed(1)}%`}
          extra={[
            <Button type="primary" key="back" onClick={() => navigate('/student/quizzes')}>
              Back to Quizzes
            </Button>
          ]}
        >
          <div style={{ marginTop: 40 }}>
            <Row gutter={[32, 32]}>
              <Col span={8}>
                <Statistic
                  title="Correct Answers"
                  value={Object.values(answers).filter((ans, idx) => ans === quiz.questions[idx].answer).length}
                  suffix={`/ ${quiz.questions.length}`}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Time Taken"
                  value={formatTime(15 * 60 - timeLeft)}
                  suffix="minutes"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Score"
                  value={score.toFixed(1)}
                  suffix="%"
                  valueStyle={{ color: score >= (quiz.passingScore || 70) ? '#52c41a' : '#faad14' }}
                />
              </Col>
            </Row>

            <Divider />

            <div style={{ marginTop: 24 }}>
              <Title level={5}>Question Analysis</Title>
              <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                {quiz.questions.map((question, index) => (
                  <Card
                    key={index}
                    style={{
                      marginBottom: 16,
                      border: '1px solid #e6f1ff',
                      borderRadius: 8
                    }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Q{index + 1}:</Text> {question.question}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          style={{
                            padding: '8px 12px',
                            marginBottom: 4,
                            borderRadius: 4,
                            backgroundColor: 
                              optIndex === question.answer ? '#f6ffed' :
                              optIndex === answers[index] && optIndex !== question.answer ? '#fff2f0' :
                              '#fafafa',
                            border: '1px solid',
                            borderColor: 
                              optIndex === question.answer ? '#b7eb8f' :
                              optIndex === answers[index] && optIndex !== question.answer ? '#ffccc7' :
                              '#f0f0f0'
                          }}
                        >
                          {option}
                          {optIndex === question.answer && (
                            <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
                          )}
                          {optIndex === answers[index] && optIndex !== question.answer && (
                            <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </Space>
            </div>
          </div>
        </Result>
      </div>
    );
  }

  return (
    <div>
      <Card
        style={{
          borderRadius: 12,
          border: '1px solid #e6f1ff',
          background: '#fff',
          marginBottom: 10
        }}
      >
        {/* Quiz Header */}
        <div style={{ marginBottom: 10 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Title level={3} style={{ margin: 0, color: BRAND_COLOR }}>
                  {quiz.title}
                </Title>
                {quiz.description && (
                  <Text type="secondary" style={{ fontSize: 16, marginTop: 8, display: 'block' }}>
                    {quiz.description}
                  </Text>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                  <Tag color="geekblue" style={{ fontWeight: 500, borderRadius: 8, fontSize: 14 }}>{quiz.topic}</Tag>
                  <Tag color={quiz.level?.toLowerCase() === 'beginner' ? 'green' : quiz.level?.toLowerCase() === 'intermediate' ? 'blue' : quiz.level?.toLowerCase() === 'advanced' ? 'volcano' : 'gold'} style={{ fontWeight: 600, fontSize: 14, borderRadius: 8 }}>{quiz.level || 'General'}</Tag>
                  {quiz.passingScore && (
                    <Tag color="blue" style={{ fontWeight: 500, borderRadius: 8, fontSize: 14 }}>
                      Pass: {quiz.passingScore}%
                    </Tag>
                  )}
                </div>
              </div>
              <Space>
                <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                  <Button
                    type="text"
                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={toggleFullscreen}
                    style={{ color: BRAND_COLOR }}
                  />
                </Tooltip>
                <Tag color="blue" style={{ fontSize: 16, padding: '4px 12px' }}>
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  {formatTime(timeLeft)}
                </Tag>
              </Space>
            </div>
            <Progress
              percent={((currentQuestion + 1) / quiz.questions.length) * 100}
              showInfo={false}
              strokeColor={BRAND_COLOR}
              trailColor="#e6f1ff"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Text>
              <Text type="secondary">
                <QuestionCircleOutlined style={{ marginRight: 4 }} />
                {quiz.questions.length} Questions
              </Text>
            </div>
          </Space>
        </div>

        {/* Current Question */}
        <Card
          style={{
            marginBottom:15,
            borderRadius: 12,
            background: '#fff',
            border: '1px solid #e6f1ff'
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
              {quiz.questions[currentQuestion].question}
            </Title>
            <Radio.Group
              value={answers[currentQuestion]}
              onChange={e => handleAnswerSelect(currentQuestion, e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <Radio
                    key={index}
                    value={index}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #e6f1ff',
                      width: '100%',
                      margin: '8px 0',
                      backgroundColor: answers[currentQuestion] === index ? '#e6f1ff' : '#fff'
                    }}
                  >
                    {option}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Space>
        </Card>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            Previous
          </Button>
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{
                background: BRAND_COLOR,
                borderColor: BRAND_COLOR,
                fontWeight: 600
              }}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              style={{
                background: BRAND_COLOR,
                borderColor: BRAND_COLOR,
                fontWeight: 600
              }}
            >
              Next
            </Button>
          )}
        </div>
      </Card>

      {/* Question Navigation */}
      <Card
        style={{
          borderRadius: 12,
          background: '#fff',
          border: '1px solid #e6f1ff'
        }}
      >
        <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
          {quiz.questions.map((_, index) => (
            <Button
              key={index}
              type={answers[index] !== null ? 'primary' : 'default'}
              onClick={() => setCurrentQuestion(index)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: answers[index] !== null ? BRAND_COLOR : '#fff',
                borderColor: answers[index] !== null ? BRAND_COLOR : '#e6f1ff',
                color: answers[index] !== null ? '#fff' : '#666'
              }}
            >
              {index + 1}
            </Button>
          ))}
        </Space>
      </Card>
    </div>
  );
} 