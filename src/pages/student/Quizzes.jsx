import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, Badge, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LANGUAGES } from '../trainer/Quizzes';

const { Title, Text } = Typography;

export default function StudentQuizzes() {
  const [quizCounts, setQuizCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch quiz counts for each language
    const fetchQuizCounts = async () => {
      const counts = {};
      for (const lang of LANGUAGES) {
        const q = query(collection(db, 'quizzes'), where('language', '==', lang.key));
        const snapshot = await getDocs(q);
        counts[lang.key] = snapshot.size;
      }
      setQuizCounts(counts);
      setLoading(false);
    };
    fetchQuizCounts();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ marginBottom: 40 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a1a' }}>
          Practice Quizzes
        </Title>
        <Text style={{ fontSize: 16, color: '#666', marginTop: 8, display: 'block' }}>
          Test your knowledge with quizzes on different programming languages and technologies
        </Text>
      </div>
      <Row gutter={[32, 32]}>
        {LANGUAGES.map(lang => (
          <Col xs={24} sm={12} md={8} lg={6} key={lang.key}>
            <Card
              hoverable
              onClick={() => navigate(`/student/quizzes/${lang.key}`)}
              style={{
                borderRadius: 18,
                boxShadow: '0 4px 24px #e6f1ff',
                background: 'rgba(255,255,255,0.95)',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                border: '1.5px solid #e6f1ff',
              }}
              bodyStyle={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <img src={lang.logo} alt={lang.name} style={{ width: 48, height: 48, borderRadius: 12, background: '#f7fafd', boxShadow: '0 2px 8px #e6f1ff' }} />
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{lang.name}</Title>
                  <Text type="secondary" style={{ fontSize: 15 }}>{lang.description}</Text>
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                <Badge count={quizCounts[lang.key] || 0} showZero color="#0067b8" style={{ fontWeight: 600 }}>
                  <span style={{ fontWeight: 500, color: '#222', fontSize: 16 }}>Quizzes</span>
                </Badge>
                <Button type="primary" style={{ fontWeight: 600, color: '#fff', background: '#0067b8' }}>
                  Start Practice
                </Button>
              </div>
              <div style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.07, fontSize: 160 }}>
                <span role="img" aria-label={lang.name}>{lang.name.charAt(0)}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
} 