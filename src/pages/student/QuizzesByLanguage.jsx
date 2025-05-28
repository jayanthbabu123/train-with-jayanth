import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Row, Col, Button, Empty, Spin, Modal, Tabs, Space, Badge, Tag, Tooltip, Popconfirm } from 'antd';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LANGUAGES } from '../trainer/Quizzes';
import { ClockCircleOutlined, QuestionCircleOutlined, CheckCircleOutlined, TrophyOutlined, HistoryOutlined, EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const BRAND_COLOR = '#0067b8';

export default function StudentQuizzesByLanguage() {
  const { language } = useParams();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [quizToView, setQuizToView] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quizSubmissions, setQuizSubmissions] = useState({});

  const lang = LANGUAGES.find(l => l.key === language);
  const topics = lang?.topics || [];

  useEffect(() => {
    if (!lang) return;
    setSelectedTopic(topics[0] || '');
  }, [language]);

  useEffect(() => {
    const fetchQuizzesAndSubmissions = async () => {
      try {
        // Fetch quizzes
        const quizzesRef = collection(db, 'quizzes');
        const q = query(quizzesRef, where('language', '==', language));
        const querySnapshot = await getDocs(q);
        const quizzesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuizzes(quizzesData);

        // Fetch quiz submissions for this user
        const submissionsRef = collection(db, 'quiz_submissions');
        const submissionsQ = query(submissionsRef, where('userId', '==', currentUser.uid));
        const submissionsSnap = await getDocs(submissionsQ);
        const submissionsData = {};
        submissionsSnap.forEach(doc => {
          const data = doc.data();
          if (!submissionsData[data.quizId] || (data.attemptNumber > submissionsData[data.quizId].attemptNumber)) {
            submissionsData[data.quizId] = { ...data, id: doc.id };
          }
        });
        setQuizSubmissions(submissionsData);
      } catch (error) {
        console.error('Error fetching quizzes or submissions:', error);
        message.error('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzesAndSubmissions();
  }, [language, currentUser.uid]);

  const getStatusBadge = (quizId, quiz) => {
    const submission = quizSubmissions[quizId];
    console.log('QUIZ:', quizId, 'submission:', submission);
    const status = submission?.status;
    console.log('QUIZ:', quizId, 'status:', status);
    if (!status) return null;

    const statusConfig = {
      passed: { color: 'success', text: 'Passed', icon: <CheckCircleOutlined /> },
      failed: { color: 'error', text: 'Failed', icon: <CloseCircleOutlined /> },
      in_progress: { color: 'processing', text: 'In Progress', icon: <ClockCircleOutlined /> }
    };

    const config = statusConfig[status];
    return config ? (
      <Tag color={config.color} className="ml-2" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {config.icon}
        {config.text}
      </Tag>
    ) : null;
  };

  const getScoreBadge = (quizId, quiz) => {
    const submission = quizSubmissions[quizId];
    console.log('QUIZ:', quizId, 'submission:', submission);
    const score = submission?.score;
    console.log('QUIZ:', quizId, 'score:', score);
    if (score === undefined) return null;

    return (
      <Tag 
        color={score >= (quiz?.passingScore || 70) ? 'success' : 'error'} 
        className="ml-2"
        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <TrophyOutlined />
        {score.toFixed(1)}%
      </Tag>
    );
  };

  const handleViewResults = (quizId) => {
    navigate(`/student/quiz-results/${quizId}`);
  };

  if (!lang) {
    return <Empty description="Language not found" style={{ marginTop: 80 }} />;
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 0 0 0', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 20,
          background: 'linear-gradient(120deg, #f7fafd 60%, #e6f1ff 100%)',
          borderRadius: 16,
          padding: '14px 18px',
          boxShadow: '0 2px 12px #e6f1ff',
          width: '100%',
          minHeight: 70,
          flexWrap: 'wrap'
        }}
      >
        <div style={{
          minWidth: 48,
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 1px 6px #e6f1ff',
          border: '1.5px solid #fff',
          marginRight: 12
        }}>
          <img
            src={lang.logo}
            alt={lang.name}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              objectFit: 'contain'
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0067b8', letterSpacing: 0.1, lineHeight: 1.5 }}>
            {lang.name}
          </div>
          <div style={{ fontSize: '0.98rem', color: '#444', fontWeight: 500, marginTop: 2 }}>
            {lang.description} Practice Quizzes to test your skills.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 7, flexWrap: 'wrap' }}>
            <span style={{
              background: '#f6ffed',
              color: '#389e0d',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderRadius: 8,
              padding: '2px 10px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 1px 2px #e6f1ff'
            }}>
              <CheckCircleOutlined style={{ marginRight: 5, color: '#52c41a', fontSize: 14 }} />
              {Object.values(quizSubmissions).filter(s => (
                s.status === 'passed' ||
                (s.score >= (quizzes.find(q => q.id === s.quizId)?.passingScore || 70))
              )).length}
              <span style={{ marginLeft: 5, color: '#444', fontWeight: 500, fontSize: '0.9rem' }}>Passed</span>
            </span>
            <span style={{
              background: '#fff7e6',
              color: '#d48806',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderRadius: 8,
              padding: '2px 10px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 1px 2px #e6f1ff'
            }}>
              <TrophyOutlined style={{ marginRight: 5, color: '#faad14', fontSize: 14 }} />
              {quizzes.length}
              <span style={{ marginLeft: 5, color: '#444', fontWeight: 500, fontSize: '0.9rem' }}>Total</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs for topics */}
      <div style={{
        margin: '0 0 32px 0',
        width: '100%',
        background: '#f4f8fc',
        borderRadius: 18,
        boxShadow: '0 2px 12px #e6f1ff',
        border: '1.5px solid #e6f1ff',
        padding: '24px 32px 32px 32px',
        position: 'relative',
        zIndex: 1,
        minHeight: 400
      }}>
        <Tabs
          activeKey={selectedTopic}
          onChange={setSelectedTopic}
          type="line"
          tabBarGutter={32}
          items={topics.map(topic => ({
            key: topic,
            label: <span style={{ fontSize: 16, fontWeight: 600 }}>{topic}</span>
          }))}
        />
        <div style={{ minHeight: 320, width: '100%' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <Spin size="large" />
            </div>
          ) : quizzes.length === 0 ? (
            <Empty description={<span style={{ fontSize: 18 }}>No quizzes available for <b>{lang.name}</b> - <b>{selectedTopic}</b></span>} style={{ margin: '64px 0' }} />
          ) : (
            <Row gutter={[32, 32]} style={{ width: '100%' }}>
              {quizzes.map(quiz => {
                const submission = quizSubmissions[quiz.id];
                const passingScore = quiz.passingScore || 70;
                const status = submission?.status ?? (submission ? (submission.score >= passingScore ? 'passed' : 'failed') : undefined);
                const score = submission?.score;
                const attemptNumber = submission?.attemptNumber;
                const lastAttempt = submission?.submittedAt ? dayjs(submission.submittedAt.toDate ? submission.submittedAt.toDate() : submission.submittedAt).format('DD MMM YYYY, HH:mm') : null;

                return (
                  <Col xs={24} sm={12} md={8} lg={6} xxl={5} key={quiz.id}>
                    <Card
                      bordered={false}
                      style={{
                        borderRadius: 14,
                        minHeight: 240,
                        background: '#fff',
                        border: '1px solid #e6eaf0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        marginBottom: 28,
                        padding: 0,
                        maxWidth: 440,
                        width: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                      bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Tooltip title={quiz.title}>
                          <span style={{
                            fontWeight: 700,
                            fontSize: 17,
                            color: '#1a1a1a',
                            wordBreak: 'break-word',
                            maxHeight: 48,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            maxWidth: 260
                          }}>{quiz.title}</span>
                        </Tooltip>
                        {status === 'passed' && <Tag color="green" style={{ fontSize: 12, borderRadius: 12, marginLeft: 8, padding: '2px 10px' }}><CheckCircleOutlined /> Passed</Tag>}
                        {status === 'failed' && <Tag color="red" style={{ fontSize: 12, borderRadius: 12, marginLeft: 8, padding: '2px 10px' }}><CloseCircleOutlined /> Not Passed</Tag>}
                      </div>
                      {/* Subheader */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <Tag color="geekblue" style={{ fontSize: 12, borderRadius: 8 }}>{quiz.topic}</Tag>
                        <Tag color={quiz.level?.toLowerCase() === 'beginner' ? 'green' : quiz.level?.toLowerCase() === 'intermediate' ? 'blue' : quiz.level?.toLowerCase() === 'advanced' ? 'volcano' : 'gold'} style={{ fontSize: 12, borderRadius: 8 }}>{quiz.level || 'General'}</Tag>
                      </div>
                      <div style={{ borderBottom: '1px solid #f0f0f0', margin: '8px 0' }} />
                      {/* Quiz Info */}
                      <div style={{ display: 'flex', gap: 14, fontSize: 13, color: '#666', marginBottom: 8 }}>
                        <span><ClockCircleOutlined style={{ marginRight: 3 }} /> 15m</span>
                        <span><QuestionCircleOutlined style={{ marginRight: 3 }} /> {quiz.questions?.length || 0} Qs</span>
                        {quiz.passingScore && <span><CheckCircleOutlined style={{ marginRight: 3 }} /> {quiz.passingScore}%</span>}
                      </div>
                      {/* Last Attempt */}
                      {submission && (
                        <div style={{
                          background: status === 'passed' ? '#f6ffed' : '#fff2f0',
                          border: '1px solid',
                          borderColor: status === 'passed' ? '#b7eb8f' : '#ffccc7',
                          borderRadius: 8,
                          padding: '8px 10px',
                          marginBottom: 8,
                          fontSize: 12,
                          color: '#222',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 4,
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TrophyOutlined style={{ color: status === 'passed' ? '#52c41a' : '#faad14' }} />
                            <span style={{ fontWeight: 600 }}>{score?.toFixed(1)}%</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span>Attempt #{attemptNumber}</span>
                          </div>
                          <div style={{}}>
                            {lastAttempt && <span>{lastAttempt}</span>}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewResults(quiz.id)} style={{ padding: 0, height: 'auto', fontSize: 12 }}>View</Button>
                          </div>
                        </div>
                      )}
                      {/* Action */}
                      <Button
                        type="primary"
                        block
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          borderRadius: 8,
                          background: status === 'failed' ? '#ff4d4f' : BRAND_COLOR,
                          borderColor: status === 'failed' ? '#ff4d4f' : BRAND_COLOR,
                          marginTop: 6
                        }}
                        onClick={() => !submission ? navigate(`/student/take-quiz/${quiz.id}`) : navigate(`/student/take-quiz/${quiz.id}`)}
                      >
                        {submission ? 'Retake Quiz' : 'Start Quiz'}
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      </div>

      {/* View Quiz Modal */}
      <Modal
        title="Quiz Preview"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>Close</Button>,
          <Button key="start" type="primary" onClick={() => {
            setViewModalOpen(false);
            // TODO: Navigate to quiz taking page
          }}>
            Start Quiz
          </Button>
        ]}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Quiz Title</Text>
            <div style={{ marginTop: 4, marginBottom: 12 }}>{quizToView?.title}</div>
            <Text strong>Level</Text>
            <div style={{ marginTop: 4, marginBottom: 12 }}>{quizToView?.level}</div>
            <Text strong>Topic</Text>
            <div style={{ marginTop: 4, marginBottom: 12 }}>{quizToView?.topic}</div>
          </div>
          <div>
            <Text strong>Questions</Text>
            {quizToView?.questions?.map((q, idx) => (
              <Card
                key={idx}
                style={{ marginBottom: 16, borderRadius: 12, background: '#f8fafd' }}
                size="small"
                title={`Q${idx + 1}`}
              >
                <div style={{ marginBottom: 8 }}>{q.question}</div>
                <div style={{ marginBottom: 8 }}>
                  {q.options.map((opt, oidx) => (
                    <div key={oidx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <Radio checked={oidx === q.answer} disabled style={{ marginRight: 8 }} />
                      <div>{opt}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
} 