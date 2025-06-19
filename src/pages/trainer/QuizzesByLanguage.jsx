import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Row, Col, Button, Empty, Spin, Modal, Tabs, Space, Upload, Divider, Input, Radio, Badge, Tag, Tooltip, Select } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LANGUAGES } from './Quizzes';
import { getAuth } from 'firebase/auth';
import { message } from 'antd';
import {CodeEditor} from '../../components/CodeEditor';

const { Title, Text } = Typography;
const { Option } = Select;

export default function QuizzesByLanguage() {
  const { language } = useParams();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createTab, setCreateTab] = useState('manual');
  const [formLoading, setFormLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizLevel, setQuizLevel] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([
    { 
      question: '', 
      questionCode: '',
      questionLanguage: 'javascript',
      options: ['', '', '', ''], 
      answer: 0 
    }
  ]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [quizToView, setQuizToView] = useState(null);
  const [editorKey, setEditorKey] = useState(0);

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

  useEffect(() => {
    if (createModalOpen) {
      setCreateTab('manual');
      setQuizTitle('');
      setQuizLevel('');
      setQuizQuestions([{ 
        question: '', 
        questionCode: '',
        questionLanguage: 'javascript',
        options: ['', '', '', ''], 
        answer: 0 
      }]);
    }
  }, [createModalOpen]);

  const handleJsonUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setQuizTitle(data.title || '');
        setQuizLevel(data.level || '');
        const transformedQuestions = (data.questions || []).map(q => {
          const options = (q.options || []).map(opt =>
            typeof opt === 'string' ? opt : (opt.text || '')
          );
          while (options.length < 4) options.push('');
          return {
            question: q.question || '',
            questionCode: q.questionCode || '',
            questionLanguage: q.questionLanguage || 'javascript',
            options,
            answer: typeof q.answer === 'number' ? q.answer : 0
          };
        });
        setQuizQuestions(transformedQuestions.length ? transformedQuestions : [{
          question: '',
          questionCode: '',
          questionLanguage: 'javascript',
          options: ['', '', '', ''],
          answer: 0
        }]);
        setCreateTab('manual');
        setEditorKey(prev => prev + 1);
        message.success('Quiz loaded from JSON successfully!');
      } catch (err) {
        console.error('JSON parsing error:', err);
        message.error('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const handleCreateQuiz = async () => {
    if (!quizTitle.trim() || !selectedTopic || quizQuestions.some(q => !q.question.trim() || q.options.some(opt => !opt.trim()))) {
      message.error('Please fill all fields and options.');
      return;
    }
    setFormLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      await addDoc(collection(db, 'quizzes'), {
        title: quizTitle,
        language: lang.key,
        topic: selectedTopic,
        level: quizLevel,
        questions: quizQuestions,
        createdBy: user ? user.uid : '',
        createdAt: new Date()
      });
      setCreateModalOpen(false);
      message.success('Quiz created successfully!');
      // Immediately refresh the quiz list
      fetchQuizzes();
    } catch (err) {
      message.error('Failed to create quiz');
    }
    setFormLoading(false);
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    setFormLoading(true);
    try {
      await deleteDoc(doc(db, 'quizzes', quizToDelete.id));
      setDeleteModalOpen(false);
      message.success('Quiz deleted successfully!');
      fetchQuizzes();
    } catch (err) {
      message.error('Failed to delete quiz');
    }
    setFormLoading(false);
  };

  const handleEditQuiz = async () => {
    if (!quizToEdit) return;
    setFormLoading(true);
    try {
      await updateDoc(doc(db, 'quizzes', quizToEdit.id), {
        title: quizTitle,
        level: quizLevel,
        questions: quizQuestions
      });
      setEditModalOpen(false);
      message.success('Quiz updated successfully!');
      fetchQuizzes();
    } catch (err) {
      message.error('Failed to update quiz');
    }
    setFormLoading(false);
  };

  const openEditModal = (quiz) => {
    setQuizToEdit(quiz);
    setQuizTitle(quiz.title);
    setQuizLevel(quiz.level);
    setQuizQuestions(quiz.questions);
    setEditModalOpen(true);
  };

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
          <Title level={2} style={{ margin: 0, fontWeight: 900, color: '#0067b8', letterSpacing: 0.5 }}>{lang.name} Quizzes</Title>
          <Text style={{ fontSize: 18, color: '#444', marginTop: 8, display: 'block', fontWeight: 500 }}>{lang.description}</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" style={{ fontWeight: 700, fontSize: 17 }} onClick={() => setCreateModalOpen(true)}>
          Create Quiz
        </Button>
      </div>
      <Divider style={{ margin: '0 0 0 0', borderColor: '#e6f1ff' }} />

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
            <Empty description={<span style={{ fontSize: 18 }}>No quizzes found for <b>{lang.name}</b> - <b>{selectedTopic}</b></span>} style={{ margin: '64px 0' }}>
              <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setCreateModalOpen(true)}>
                Create Quiz
              </Button>
            </Empty>
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
                      transition: 'box-shadow 0.2s, border-color 0.2s',
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
                    {/* 4th row: Created date (left), Quiz label (right) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {quiz.createdAt?.toDate ? `Created: ${quiz.createdAt.toDate().toLocaleDateString()}` : ''}
                      </Text>
                      <Tag color="#e6f1ff" style={{ color: '#0067b8', fontWeight: 600, borderRadius: 8, fontSize: 13 }}>Quiz</Tag>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
                      <Button type="outlined" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); openEditModal(quiz); }}>Edit</Button>
                      <Button type="outlined" danger icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); setQuizToDelete(quiz); setDeleteModalOpen(true); }}>Delete</Button>
                      <Button type="outlined" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); setQuizToView(quiz); setViewModalOpen(true); }}>View</Button>
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

      {/* Create Quiz Modal */}
      <Modal
        title="Create New Quiz"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        width={700}
        style={{ top: 40 }}
        bodyStyle={{ padding: 32 }}
      >
        <Tabs activeKey={createTab} onChange={setCreateTab} items={[
          {
            key: 'manual',
            label: 'Manual Entry',
            children: (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Quiz Title</Text>
                  <Input
                    style={{ width: '100%', marginTop: 4, marginBottom: 12 }}
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                    placeholder="Enter quiz title"
                  />
                  <Text strong>Level</Text>
                  <Input
                    style={{ width: '100%', marginTop: 4, marginBottom: 12 }}
                    value={quizLevel}
                    onChange={e => setQuizLevel(e.target.value)}
                    placeholder="e.g. Beginner, Intermediate, Advanced"
                  />
                  <Text strong>Topic</Text>
                  <Input
                    style={{ width: '100%', marginTop: 4, marginBottom: 12 }}
                    value={selectedTopic}
                    disabled
                  />
                </div>
                <div>
                  <Text strong>Questions</Text>
                  {quizQuestions.map((q, idx) => (
                    <Card
                      key={idx}
                      style={{ marginBottom: 16, borderRadius: 12, background: '#f8fafd' }}
                      size="small"
                      title={`Q${idx + 1}`}
                      extra={quizQuestions.length > 1 && (
                        <Button type="text" icon={<DeleteOutlined />} danger onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))} />
                      )}
                    >
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>Question Text</Text>
                        <Input
                          style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                          value={q.question}
                          onChange={e => {
                            const arr = [...quizQuestions];
                            arr[idx].question = e.target.value;
                            setQuizQuestions(arr);
                          }}
                          placeholder="Enter question"
                        />
                        <Text strong>Question Code (optional)</Text>
                        <div style={{ marginTop: 4, marginBottom: 8 }}>
                          <CodeEditor
                            key={editorKey + '-' + idx}
                            value={q.questionCode}
                            onChange={value => {
                              const arr = [...quizQuestions];
                              arr[idx].questionCode = value;
                              setQuizQuestions(arr);
                            }}
                            language={q.questionLanguage}
                            height="150px"
                            theme="vs-dark"
                          />
                        </div>
                        <Select
                          style={{ width: 200, marginBottom: 8 }}
                          value={q.questionLanguage}
                          onChange={value => {
                            const arr = [...quizQuestions];
                            arr[idx].questionLanguage = value;
                            setQuizQuestions(arr);
                          }}
                        >
                          <Option value="javascript">JavaScript</Option>
                          <Option value="python">Python</Option>
                          <Option value="java">Java</Option>
                          <Option value="cpp">C++</Option>
                        </Select>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Radio.Group
                          value={q.answer}
                          onChange={e => {
                            const arr = [...quizQuestions];
                            arr[idx].answer = e.target.value;
                            setQuizQuestions(arr);
                          }}
                          style={{ width: '100%' }}
                        >
                          {q.options.map((opt, oidx) => (
                            <div key={oidx} style={{ marginBottom: 16, padding: 12, background: '#fff', borderRadius: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <Radio value={oidx} style={{ marginRight: 8 }} />
                                <Input
                                  style={{ flex: 1 }}
                                  value={opt}
                                  onChange={e => {
                                    const arr = [...quizQuestions];
                                    arr[idx].options[oidx] = e.target.value;
                                    setQuizQuestions(arr);
                                  }}
                                  placeholder={`Option ${oidx + 1} text`}
                                />
                              </div>
                            </div>
                          ))}
                        </Radio.Group>
                      </div>
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const arr = [...quizQuestions];
                          arr[idx].options.push('');
                          setQuizQuestions(arr);
                        }}
                        size="small"
                        style={{ marginBottom: 8 }}
                      >
                        Add Option
                      </Button>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => setQuizQuestions([...quizQuestions, { 
                      question: '', 
                      questionCode: '',
                      questionLanguage: 'javascript',
                      options: ['', '', '', ''], 
                      answer: 0 
                    }])}
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    Add Question
                  </Button>
                </div>
                <Button
                  type="primary"
                  loading={formLoading}
                  onClick={handleCreateQuiz}
                  style={{ width: '100%', marginTop: 24, fontWeight: 600 }}
                  size="large"
                >
                  Create Quiz
                </Button>
              </div>
            )
          },
          {
            key: 'upload',
            label: 'Upload JSON',
            children: (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <Upload
                  accept="application/json"
                  showUploadList={false}
                  beforeUpload={handleJsonUpload}
                >
                  <Button icon={<UploadOutlined />} size="large" type="primary">
                    Upload Quiz JSON
                  </Button>
                </Upload>
                <div style={{ marginTop: 24, color: '#888' }}>
                  <Text type="secondary">
                    Upload a JSON file with the following structure:<br />
                    <pre style={{ textAlign: 'left', background: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 8, marginTop: 8 }}>
{`{
  "title": "Quiz Title",
  "level": "Beginner",
  "questions": [
    {
      "question": "What will be the result of this function?",
      "questionCode": "function greet(name) {\n  return 'Hello ' + name;\n}\nconsole.log(greet('Alice'));",
      "questionLanguage": "javascript",
      "options": [
        "Hello Alice",
        "Hello",
        "Alice Hello",
        "Hi Alice"
      ],
      "answer": 0
    }
  ]
}`}
                    </pre>
                    <div style={{ marginTop: 8, color: '#ff7875' }}>
                      <b>Note:</b> <br />
                      - <b>Only</b> <code>questionCode</code> is supported for code snippets (not in options).<br />
                      - <code>options</code> must be an array of strings.<br />
                      - <code>answer</code> is the index (0-based) of the correct option.
                    </div>
                  </Text>
                </div>
              </div>
            )
          }
        ]} />
      </Modal>

      {/* Delete Quiz Modal */}
      <Modal
        title="Delete Quiz"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>,
          <Button key="delete" type="primary" danger loading={formLoading} onClick={handleDeleteQuiz}>Delete</Button>
        ]}
      >
        <p>Are you sure you want to delete the quiz "{quizToDelete?.title}"?</p>
      </Modal>

      {/* Edit Quiz Modal */}
      <Modal
        title="Edit Quiz"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" loading={formLoading} onClick={handleEditQuiz}>Save</Button>
        ]}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Quiz Title</Text>
            <Input
              style={{ width: '100%', marginTop: 4, marginBottom: 12 }}
              value={quizTitle}
              onChange={e => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
            />
            <Text strong>Level</Text>
            <Input
              style={{ width: '100%', marginTop: 4, marginBottom: 12 }}
              value={quizLevel}
              onChange={e => setQuizLevel(e.target.value)}
              placeholder="e.g. Beginner, Intermediate, Advanced"
            />
            <Text strong>Topic</Text>
            <Input
              style={{ width: '100%', marginTop: 4, marginBottom: 12 }}
              value={selectedTopic}
              disabled
            />
          </div>
          <div>
            <Text strong>Questions</Text>
            {quizQuestions.map((q, idx) => (
              <Card
                key={idx}
                style={{ marginBottom: 16, borderRadius: 12, background: '#f8fafd' }}
                size="small"
                title={`Q${idx + 1}`}
                extra={quizQuestions.length > 1 && (
                  <Button type="text" icon={<DeleteOutlined />} danger onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))} />
                )}
              >
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Question Text</Text>
                  <Input
                    style={{ width: '100%', marginTop: 4, marginBottom: 8 }}
                    value={q.question}
                    onChange={e => {
                      const arr = [...quizQuestions];
                      arr[idx].question = e.target.value;
                      setQuizQuestions(arr);
                    }}
                    placeholder="Enter question"
                  />
                  <Text strong>Question Code (optional)</Text>
                  <div style={{ marginTop: 4, marginBottom: 8 }}>
                    <CodeEditor
                      key={editorKey + '-' + idx}
                      value={q.questionCode}
                      onChange={value => {
                        const arr = [...quizQuestions];
                        arr[idx].questionCode = value;
                        setQuizQuestions(arr);
                      }}
                      language={q.questionLanguage}
                      height="150px"
                      theme="vs-dark"
                    />
                  </div>
                  <Select
                    style={{ width: 200, marginBottom: 8 }}
                    value={q.questionLanguage}
                    onChange={value => {
                      const arr = [...quizQuestions];
                      arr[idx].questionLanguage = value;
                      setQuizQuestions(arr);
                    }}
                  >
                    <Option value="javascript">JavaScript</Option>
                    <Option value="python">Python</Option>
                    <Option value="java">Java</Option>
                    <Option value="cpp">C++</Option>
                  </Select>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Radio.Group
                    value={q.answer}
                    onChange={e => {
                      const arr = [...quizQuestions];
                      arr[idx].answer = e.target.value;
                      setQuizQuestions(arr);
                    }}
                    style={{ width: '100%' }}
                  >
                    {q.options.map((opt, oidx) => (
                      <div key={oidx} style={{ marginBottom: 16, padding: 12, background: '#fff', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                          <Radio value={oidx} style={{ marginRight: 8 }} />
                          <Input
                            style={{ flex: 1 }}
                            value={opt}
                            onChange={e => {
                              const arr = [...quizQuestions];
                              arr[idx].options[oidx] = e.target.value;
                              setQuizQuestions(arr);
                            }}
                            placeholder={`Option ${oidx + 1} text`}
                          />
                        </div>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const arr = [...quizQuestions];
                    arr[idx].options.push('');
                    setQuizQuestions(arr);
                  }}
                  size="small"
                  style={{ marginBottom: 8 }}
                >
                  Add Option
                </Button>
              </Card>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setQuizQuestions([...quizQuestions, { 
                question: '', 
                questionCode: '',
                questionLanguage: 'javascript',
                options: ['', '', '', ''], 
                answer: 0 
              }])}
              style={{ width: '100%', marginTop: 8 }}
            >
              Add Question
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Quiz Modal */}
      <Modal
        title="View Quiz"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>Close</Button>
        ]}
        width={800}
      >
        <div>
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ fontSize: 16 }}>Quiz Title</Text>
            <div style={{ marginTop: 4, marginBottom: 16, fontSize: 18 }}>{quizToView?.title}</div>
            <Text strong style={{ fontSize: 16 }}>Level</Text>
            <div style={{ marginTop: 4, marginBottom: 16 }}>{quizToView?.level}</div>
            <Text strong style={{ fontSize: 16 }}>Topic</Text>
            <div style={{ marginTop: 4, marginBottom: 16 }}>{quizToView?.topic}</div>
          </div>
          <div>
            <Text strong style={{ fontSize: 16, marginBottom: 16, display: 'block' }}>Questions</Text>
            {quizToView?.questions?.map((q, idx) => (
              <Card
                key={idx}
                style={{ marginBottom: 24, borderRadius: 12, background: '#f8fafd' }}
                size="small"
                title={`Question ${idx + 1}`}
              >
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Question:</Text>
                  <div style={{ marginBottom: 12 }}>{q.question}</div>
                  {q.questionCode && q.questionCode.trim() && (
                    <div style={{ marginBottom: 16 }}>
                      <Text strong style={{ display: 'block', marginBottom: 8 }}>Code:</Text>
                      <div style={{ 
                        background: '#1e1e1e', 
                        padding: 16, 
                        borderRadius: 8,
                        fontFamily: 'monospace',
                        color: '#fff',
                        whiteSpace: 'pre-wrap',
                        fontSize: 15
                      }}>
                        {q.questionCode}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 12 }}>Options:</Text>
                  {q.options.map((opt, oidx) => (
                    <div 
                      key={oidx} 
                      style={{ 
                        marginBottom: 16,
                        padding: 12,
                        background: oidx === q.answer ? '#e6f7ff' : '#fff',
                        border: oidx === q.answer ? '1px solid #91d5ff' : '1px solid #f0f0f0',
                        borderRadius: 8
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Radio checked={oidx === q.answer} disabled style={{ marginTop: 4 }} />
                        <div style={{ flex: 1 }}>
                          <div>{opt}</div>
                        </div>
                      </div>
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