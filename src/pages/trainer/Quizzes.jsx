import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, Badge, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import PageHeader from '../../components/common/PageHeader';

const { Title, Text } = Typography;

export const LANGUAGES = [
  {
    key: 'javascript',
    name: 'JavaScript',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    description: 'Modern web scripting language.',
    topics: ['Basics', 'ES6', 'DOM', 'Functions', 'Async', 'OOP']
  },
  {
    key: 'html',
    name: 'HTML',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    description: 'Structure and organize web content.',
    topics: ['Elements', 'Forms', 'Semantics', 'Media', 'SEO']
  },
  {
    key: 'css',
    name: 'CSS',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    description: 'Style and design web pages.',
    topics: ['Selectors', 'Flexbox', 'Grid', 'Animations', 'Responsive']
  },
  {
    key: 'bootstrap',
    name: 'Bootstrap',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
    description: 'Responsive design framework.',
    topics: ['Grid', 'Components', 'Utilities', 'Customization']
  },
  {
    key: 'react',
    name: 'React',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    description: 'Modern UI development library.',
    topics: ['JSX', 'Hooks', 'State', 'Props', 'Lifecycle', 'Context']
  },
  {
    key: 'nodejs',
    name: 'NodeJS',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    description: 'Server-side JavaScript runtime.',
    topics: ['Modules', 'File System', 'Events', 'Streams', 'APIs']
  },
  {
    key: 'expressjs',
    name: 'ExpressJS',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    description: 'Fast, unopinionated web framework.',
    topics: ['Routing', 'Middleware', 'REST', 'Error Handling']
  },
  {
    key: 'mongodb',
    name: 'MongoDB',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    description: 'NoSQL database for modern apps.',
    topics: ['CRUD', 'Aggregation', 'Indexes', 'Schema Design']
  },
];

export default function TrainerQuizzes() {
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
    <div style={{  margin: '0 auto', padding: '32px 0' }}>
      <PageHeader
        title="Quiz Management"
        subtitle="Create and manage quizzes for different programming languages and technologies"
      />
      <Row gutter={[32, 32]}>
        {LANGUAGES.map(lang => (
          <Col xs={24} sm={12} md={8} lg={6} key={lang.key}>
            <Card
              hoverable
              onClick={() => navigate(`/trainer/quizzes/${lang.key}`)}
              style={{
                borderRadius: 18,
                boxShadow: '0 4px 24px #e6f1ff',
                background: 'rgba(255,255,255,0.95)',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
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
                <Button type="link" style={{ fontWeight: 600, color: '#0067b8' }}>
                  View Quizzes
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