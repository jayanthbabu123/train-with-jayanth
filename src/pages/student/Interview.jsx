import React, { useState } from 'react';
import { Card, Row, Col, Typography, Space, Input, Button, Tag, Divider } from 'antd';
import { 
  CodeOutlined,
  RightOutlined,
  LeftOutlined,
  StarOutlined,
  BookOutlined,
  BulbOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { 
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact
} from 'react-icons/fa';
import { 
  SiTypescript
} from 'react-icons/si';

const Interview = () => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const technologies = [
    {
      id: 'html',
      name: 'HTML',
      icon: <FaHtml5 style={{ fontSize: '48px', color: '#e34f26' }} />,
      color: '#e34f26',
      description: 'HyperText Markup Language - The foundation of web development',
      questionCount: 25
    },
    {
      id: 'css',
      name: 'CSS',
      icon: <FaCss3Alt style={{ fontSize: '48px', color: '#1572b6' }} />,
      color: '#1572b6',
      description: 'Cascading Style Sheets - Styling and layout for web pages',
      questionCount: 30
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: <FaJs style={{ fontSize: '48px', color: '#f7df1e' }} />,
      color: '#f7df1e',
      description: 'Dynamic programming language for web interactivity',
      questionCount: 40
    },
    {
      id: 'react',
      name: 'React',
      icon: <FaReact style={{ fontSize: '48px', color: '#61dafb' }} />,
      color: '#61dafb',
      description: 'JavaScript library for building user interfaces',
      questionCount: 35
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      icon: <SiTypescript style={{ fontSize: '48px', color: '#3178c6' }} />,
      color: '#3178c6',
      description: 'Typed superset of JavaScript for better development',
      questionCount: 20
    },

  ];

  const questions = {
    html: [
      {
        question: "What is the difference between HTML and XHTML?",
        answer: "HTML is more lenient with syntax while XHTML requires strict XML-like syntax. XHTML is case-sensitive and requires all tags to be properly closed.",
        difficulty: "Intermediate"
      },
      {
        question: "Explain the semantic HTML elements and their importance.",
        answer: "Semantic elements like <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer> provide meaning to the structure, improving accessibility and SEO.",
        difficulty: "Intermediate"
      },
      {
        question: "What is the purpose of the DOCTYPE declaration?",
        answer: "The DOCTYPE declaration tells the browser which version of HTML the document is written in, ensuring proper rendering and avoiding quirks mode.",
        difficulty: "Beginner"
      }
    ],
    css: [
      {
        question: "Explain the CSS Box Model.",
        answer: "The CSS Box Model consists of content, padding, border, and margin. It determines how elements are sized and spaced.",
        difficulty: "Beginner"
      },
      {
        question: "What is the difference between display: none and visibility: hidden?",
        answer: "display: none removes the element from the layout completely, while visibility: hidden hides the element but preserves its space in the layout.",
        difficulty: "Intermediate"
      },
      {
        question: "How do CSS Grid and Flexbox differ?",
        answer: "Flexbox is designed for one-dimensional layouts (row or column), while CSS Grid is designed for two-dimensional layouts (rows and columns simultaneously).",
        difficulty: "Intermediate"
      }
    ],
    javascript: [
      {
        question: "What is the difference between let, const, and var?",
        answer: "var is function-scoped and hoisted, let is block-scoped and not hoisted, const is block-scoped and cannot be reassigned after declaration.",
        difficulty: "Beginner"
      },
      {
        question: "Explain closures in JavaScript.",
        answer: "A closure is a function that has access to variables in its outer scope even after the outer function has returned. It creates a private scope for variables.",
        difficulty: "Advanced"
      },
      {
        question: "What is the event loop in JavaScript?",
        answer: "The event loop is a mechanism that allows JavaScript to perform non-blocking operations by using callbacks, promises, and async/await, even though it's single-threaded.",
        difficulty: "Advanced"
      }
    ],
    react: [
      {
        question: "What are React hooks and how do they work?",
        answer: "React hooks are functions that allow you to use state and other React features in functional components. They must be called at the top level of the component.",
        difficulty: "Intermediate"
      },
      {
        question: "Explain the difference between state and props.",
        answer: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component that can trigger re-renders when changed.",
        difficulty: "Intermediate"
      },
      {
        question: "What is the virtual DOM and how does it work?",
        answer: "The virtual DOM is a lightweight copy of the actual DOM. React uses it to compare changes and efficiently update only the necessary parts of the real DOM.",
        difficulty: "Intermediate"
      }
    ],
    typescript: [
      {
        question: "What are TypeScript interfaces and how do they differ from types?",
        answer: "Interfaces define object shapes and can be extended/merged, while types are more flexible and can represent unions, intersections, and primitive types.",
        difficulty: "Intermediate"
      },
      {
        question: "Explain TypeScript generics.",
        answer: "Generics allow you to create reusable components that work with multiple types while maintaining type safety.",
        difficulty: "Advanced"
      },
      {
        question: "What is type inference in TypeScript?",
        answer: "TypeScript automatically infers types based on the values you assign, reducing the need for explicit type annotations.",
        difficulty: "Beginner"
      }
    ],

  };

  const filteredQuestions = selectedTech && questions[selectedTech] 
    ? questions[selectedTech].filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CodeOutlined style={{ fontSize: '48px', color: '#1890ff', marginRight: '16px' }} />
                <Typography.Title level={1} style={{ margin: 0, color: '#262626' }}>
                  Frontend Interview Questions
                </Typography.Title>
              </div>
              <Typography.Title level={3} style={{ margin: 0, color: '#8c8c8c', fontWeight: 'normal' }}>
                Master your frontend development skills with comprehensive interview questions
              </Typography.Title>
              <Space size="large">
                <Space>
                  <BookOutlined style={{ color: '#1890ff' }} />
                  <span style={{ color: '#8c8c8c' }}>5 Technologies</span>
                </Space>
                <Space>
                  <StarOutlined style={{ color: '#1890ff' }} />
                  <span style={{ color: '#8c8c8c' }}>165+ Questions</span>
                </Space>
                <Space>
                  <BulbOutlined style={{ color: '#1890ff' }} />
                  <span style={{ color: '#8c8c8c' }}>Detailed Answers</span>
                </Space>
              </Space>
            </Space>
          </div>
        </div>
      </div>

            {/* Main Content */}
      <div className="container" style={{ padding: '48px 0' }}>
        {!selectedTech ? (
          // Technology Selection Grid
          <Row gutter={[24, 24]} justify="center">
            {technologies.map((tech) => (
              <Col xs={24} sm={12} lg={8} key={tech.id}>
                <Card
                  hoverable
                  style={{ 
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => setSelectedTech(tech.id)}
                >
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                      {tech.icon}
                    </div>
                    <div>
                      <Typography.Title level={3} style={{ margin: 0, color: '#262626' }}>
                        {tech.name}
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
                        {tech.description}
                      </Typography.Text>
                    </div>
                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      {tech.questionCount} Questions
                    </Tag>
                  </Space>
                  <Divider style={{ margin: '16px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                      Click to explore
                    </Typography.Text>
                    <RightOutlined style={{ color: '#1890ff' }} />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          // Questions List View
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Back Button and Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
              <Col>
                <Button 
                  type="text" 
                  icon={<LeftOutlined />}
                  onClick={() => setSelectedTech(null)}
                  style={{ fontSize: '16px' }}
                >
                  Back to Technologies
                </Button>
              </Col>
              <Col>
                <div style={{ textAlign: 'center' }}>
                  <Typography.Title level={2} style={{ margin: 0, color: '#262626' }}>
                    {technologies.find(t => t.id === selectedTech)?.name} Questions
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {filteredQuestions.length} questions available
                  </Typography.Text>
                </div>
              </Col>
              <Col style={{ width: '100px' }}></Col>
            </Row>

            {/* Search */}
            <Card style={{ marginBottom: '32px' }}>
              <Input
                placeholder="Search questions..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="large"
              />
            </Card>

            {/* Questions List */}
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {filteredQuestions.map((q, index) => (
                <Card key={index} style={{ borderRadius: '8px' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Space size="small" style={{ marginBottom: '12px' }}>
                        <Tag color="blue">Q{index + 1}</Tag>
                        <Tag color={getDifficultyColor(q.difficulty)}>{q.difficulty}</Tag>
                      </Space>
                      <Typography.Title level={4} style={{ margin: 0, color: '#262626' }}>
                        {q.question}
                      </Typography.Title>
                    </div>
                    
                    <Card 
                      size="small" 
                      style={{ 
                        backgroundColor: '#fafafa',
                        borderLeft: '4px solid #1890ff'
                      }}
                    >
                      <Space direction="vertical" size="small">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <BulbOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                          <Typography.Text strong>Answer:</Typography.Text>
                        </div>
                        <Typography.Text type="secondary">
                          {q.answer}
                        </Typography.Text>
                      </Space>
                    </Card>
                  </Space>
                </Card>
              ))}
            </Space>

            {filteredQuestions.length === 0 && (
              <Card style={{ textAlign: 'center', padding: '48px' }}>
                <Space direction="vertical" size="large">
                  <SearchOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                  <div>
                    <Typography.Title level={4} style={{ margin: 0, color: '#8c8c8c' }}>
                      No questions found
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      Try adjusting your search criteria
                    </Typography.Text>
                  </div>
                </Space>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#001529', color: 'white', padding: '32px 0', marginTop: '48px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Typography.Text style={{ color: '#8c8c8c' }}>
            © 2024 Frontend Interview Prep. Master your skills and ace your interviews.
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default Interview;
