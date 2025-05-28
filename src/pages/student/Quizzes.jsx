import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, Badge, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LANGUAGES } from '../trainer/Quizzes';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';

const { Title, Text } = Typography;

export default function StudentQuizzes() {
  const [quizCounts, setQuizCounts] = useState({});
  const [quizSubmissions, setQuizSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [allQuizzes, setAllQuizzes] = useState([]);

  useEffect(() => {
    // Fetch quiz counts and submissions for each language
    const fetchQuizData = async () => {
      const counts = {};
      const submissionsByLang = {};
      const quizIdToLanguage = {};
      let allQuizzesTemp = [];
      for (const lang of LANGUAGES) {
        const q = query(collection(db, 'quizzes'), where('language', '==', lang.key));
        const snapshot = await getDocs(q);
        counts[lang.key] = snapshot.size;
        allQuizzesTemp = allQuizzesTemp.concat(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      // Build quizId to language map
      allQuizzesTemp.forEach(q => { quizIdToLanguage[q.id] = q.language; });
      // Fetch all quiz submissions for this user
      const submissionsRef = collection(db, 'quiz_submissions');
      const submissionsQ = query(submissionsRef, where('userId', '==', currentUser.uid));
      const submissionsSnap = await getDocs(submissionsQ);
      submissionsSnap.forEach(doc => {
        const data = doc.data();
        const langKey = quizIdToLanguage[data.quizId];
        if (!langKey) return; // skip if quiz not found
        if (!submissionsByLang[langKey]) submissionsByLang[langKey] = [];
        submissionsByLang[langKey].push({ ...data, id: doc.id });
      });
      setQuizCounts(counts);
      setQuizSubmissions(submissionsByLang);
      setAllQuizzes(allQuizzesTemp);
      setLoading(false);
    };
    fetchQuizData();
  }, [currentUser.uid]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ margin: '0 auto', padding: '32px 0' }}>
      <div style={{ marginBottom: 40 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a1a' }}>
          Practice Quizzes
        </Title>
        <Text style={{ fontSize: 16, color: '#666', marginTop: 8, display: 'block' }}>
          Test your knowledge with quizzes on different programming languages and technologies
        </Text>
      </div>
      <Row gutter={[10, 10]}>
        {LANGUAGES.map(lang => {
          const submissions = quizSubmissions[lang.key] || [];
          // Group by quizId and get the latest submission for each quiz
          const latestByQuiz = uniqBy(
            submissions.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0)),
            'quizId'
          );
          // For each quiz, get the quiz object to get passingScore
          const quizzesForLang = allQuizzes.filter(q => q.language === lang.key);
          const quizIdToPassingScore = {};
          quizzesForLang.forEach(q => { quizIdToPassingScore[q.id] = q.passingScore || 70; });
          const passed = latestByQuiz.filter(s => (s.score ?? 0) >= (quizIdToPassingScore[s.quizId] || 70)).length;
          const bestScore = latestByQuiz.length > 0 ? Math.max(...latestByQuiz.map(s => s.score || 0)) : null;
          const lastAttempt = latestByQuiz.length > 0 ? dayjs(Math.max(...latestByQuiz.map(s => s.submittedAt?.toDate ? s.submittedAt.toDate() : s.submittedAt))).format('DD MMM YYYY, HH:mm') : null;
          console.log('LANG:', lang.key, 'submissions:', submissions);
          console.log('LANG:', lang.key, 'latestByQuiz:', latestByQuiz);
          console.log('LANG:', lang.key, 'passed:', passed);
          return (
            <Col xs={24} sm={12} md={8} lg={8} xxl={5} key={lang.key}>
              <Card
                hoverable
                onClick={() => navigate(`/student/quizzes/${lang.key}`)}
                style={{
                  borderRadius: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  background: '#fff',
                  border: '1.5px solid #e6eaf0',
                  marginBottom: 10,
                  padding: 0,
                  maxWidth: 440,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  cursor: 'pointer',
                }}
                bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                  <img src={lang.logo} alt={lang.name} style={{ width: 48, height: 48, borderRadius: 12, background: '#f7fafd', boxShadow: '0 2px 8px #e6f1ff' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a', wordBreak: 'break-word', maxHeight: 48, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{lang.name}</span>
                    <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{lang.description}</div>
                  </div>
                </div>
                <div style={{ borderBottom: '1px solid #f0f0f0', margin: '8px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13, color: '#444', marginBottom: 8 }}>
                  <div><b>Quizzes:</b> {quizCounts[lang.key] || 0}</div>
                  <div style={{ color: '#52c41a' }}><b>Passed:</b> {passed}</div>
                  <div style={{ color: '#faad14' }}><b>Best:</b> {bestScore !== null ? bestScore.toFixed(1) + '%' : '-'}</div>
                  <div style={{ color: '#888' }}><b>Last:</b> {lastAttempt || '-'}</div>
                </div>
                <Button type="primary" block style={{ fontWeight: 600, fontSize: 15, borderRadius: 8, background: '#0067b8', marginTop: 8 }}>
                  Start Practice
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
} 
