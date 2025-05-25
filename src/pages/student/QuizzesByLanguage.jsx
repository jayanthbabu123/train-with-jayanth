import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Row, Col, Button, Empty, Spin, Modal, Tabs, Space, Badge, Tag, Tooltip } from 'antd';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LANGUAGES } from '../trainer/Quizzes';

const { Title, Text } = Typography;

export default function StudentQuizzesByLanguage() {
  const { language } = useParams();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [quizToView, setQuizToView] = useState(null);

  const lang = LANGUAGES.find(l => l.key === language);
  const topics = lang?.topics || [];

  useEffect(() => {
    if (!lang) return;
    setSelectedTopic(topics[0] || '');
  }, [language]);

  // Fetch quizzes for the selected language/topic
  const fetchQuizzes = async () => {
    if (!lang || !selectedTopic) return;
    setLoading(true);
    const q = query(
      collection(db, 'quizzes'),
      where('language', '==', lang.key),
      where('topic', '==', selectedTopic)
    );
    const snapshot = await getDocs(q);
    setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line
  }, [lang, selectedTopic]);

  if (!lang) {
    return <Empty description="Language not found" style={{ marginTop: 80 }} />;
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 0 0 0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        marginBottom: 32,
        background: 'linear-gradient(135deg, #f7fafd 60%, #e6f1ff 100%)',
        borderRadius: 24,
        padding: '32px 40px',
        boxShadow: '0 4px 24px #e6f1ff',
        width: '100%',
        minHeight: 120
      }}>
        <img src={lang.logo} alt={lang.name} style={{ width: 80, height: 80, borderRadius: 18, background: '#fff', boxShadow: '0 2px 12px #e6f1ff', border: '2px solid #fff' }} />
        <div style={{ flex: 1 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 900, color: '#0067b8', letterSpacing: 0.5 }}>{lang.name} Practice Quizzes</Title>
          <Text style={{ fontSize: 18, color: '#444', marginTop: 8, display: 'block', fontWeight: 500 }}>{lang.description}</Text>
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
              {quizzes.map(quiz => (
                <Col xs={24} sm={12} md={8} lg={6} key={quiz.id}>
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 20,
                      boxShadow: '0 8px 32px 0 rgba(0, 103, 184, 0.10)',
                      minHeight: 210,
                      background: 'linear-gradient(135deg, #fafdff 60%, #e6f1ff 100%)',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      border: '1.5px solid #e6f1ff',
                      marginBottom: 24,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    bodyStyle={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}
                    hoverable
                    onClick={() => {
                      setQuizToView(quiz);
                      setViewModalOpen(true);
                    }}
                  >
                    {/* 1st row: Title */}
                    <div style={{ marginBottom: 10 }}>
                      <Tooltip title={quiz.title}>
                        <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0067b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{quiz.title}</Title>
                      </Tooltip>
                    </div>
                    {/* 2nd row: Topic and Level badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <Tag color="geekblue" style={{ fontWeight: 500, borderRadius: 8, fontSize: 14 }}>{quiz.topic}</Tag>
                      <Tag color={quiz.level?.toLowerCase() === 'beginner' ? 'green' : quiz.level?.toLowerCase() === 'intermediate' ? 'blue' : quiz.level?.toLowerCase() === 'advanced' ? 'volcano' : 'gold'} style={{ fontWeight: 600, fontSize: 14, borderRadius: 8 }}>{quiz.level || 'General'}</Tag>
                    </div>
                    {/* 3rd row: Total questions */}
                    <div style={{ marginBottom: 14 }}>
                      <Badge count={quiz.questions?.length || 0} style={{ backgroundColor: '#0067b8', fontWeight: 600, fontSize: 15 }}>
                        <span style={{ color: '#222', fontWeight: 500, fontSize: 15 }}>Questions</span>
                      </Badge>
                    </div>
                    {/* 4th row: Start Quiz button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                      <Button type="primary" style={{ width: '100%', fontWeight: 600 }}>
                        Start Quiz
                      </Button>
                    </div>
                    <div style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.07, fontSize: 120 }}>
                      <span role="img" aria-label="quiz">📝</span>
                    </div>
                  </Card>
                </Col>
              ))}
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