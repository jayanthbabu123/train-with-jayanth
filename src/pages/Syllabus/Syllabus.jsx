import React, { useState } from "react";
import ContactModal from "../../components/ContactModal";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Timeline,
  Tag,
  Space,
  Divider,
  List,
  Avatar,
  Badge,
  Rate,
} from "antd";
import {
  Html5Outlined,
  FileTextOutlined,
  JavaScriptOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TrophyOutlined,
  BookOutlined,
  CodeOutlined,
  RocketOutlined,
  StarOutlined,
  LinkedinOutlined,
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  MessageOutlined,
  ExperimentOutlined,
  MediumOutlined,
  EditOutlined,
  HeartOutlined,
  FireOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Syllabus.css";

const { Title, Paragraph, Text } = Typography;

const Syllabus = () => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [enrollModalVisible, setEnrollModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleContactModalOpen = () => {
    setEnrollModalVisible(true);
  };

  // Add floating button styles
  const floatingButtonStyles = `
    .floating-contact-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1890ff, #096dd9);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.5);
      z-index: 999;
      border: none;
      transition: all 0.3s ease;
    }

    .floating-contact-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.6);
    }

    .floating-contact-btn .anticon {
      font-size: 24px;
      color: white;
    }

    @media (max-width: 768px) {
      .floating-contact-btn {
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
      }
    }
  `;

  // CSS styles for hero action buttons
  const heroButtonStyles = `
    .hero-action-buttons {
      display: flex;
      gap: 16px;
      margin-top: 24px;
    }

    .enroll-button {
      background: linear-gradient(to right, #1890ff, #096dd9);
      border: none;
      padding: 0 28px;
      height: 48px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      transition: all 0.3s ease;
    }

    .enroll-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
      background: linear-gradient(to right, #40a9ff, #1890ff);
    }

    .contact-button {
      border: 2px solid #1890ff;
      color: #1890ff;
      padding: 0 28px;
      height: 48px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .contact-button:hover {
      background: rgba(24, 144, 255, 0.1);
      border-color: #40a9ff;
      color: #40a9ff;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .hero-action-buttons {
        flex-direction: column;
        gap: 12px;
      }

      .enroll-button, .contact-button {
        width: 100%;
      }
    }
  `;

  const technologies = [
    {
      id: "html",
      title: "HTML & HTML5",
      icon: <Html5Outlined />,
      color: "#e34f26",
      description: "Foundation of web development with semantic markup",
      duration: "1 Week",
      level: "Beginner",
      syllabus: [
        {
          title: "HTML5 Introduction",
          topics: [
            "What is HTML5 and its importance",
            "HTML Document Structure",
            "HTML5 vs Previous Versions",
            "Browser Support and Compatibility",
          ],
        },
        {
          title: "Head Tag Elements",
          topics: [
            "Link tag for external resources",
            "Title tag for page titles",
            "Style tag for internal CSS",
            "Meta tags for SEO and responsive design",
            "Favicon and other meta information",
          ],
        },
        {
          title: "Body Tag and Content Structure",
          topics: [
            "Body tag attributes and usage",
            "Document flow and structure",
            "Content organization best practices",
          ],
        },
        {
          title: "Block Level Elements",
          topics: [
            "Div, P, H1-H6 tags",
            "Section, Article, Header, Footer",
            "Nav, Aside, Main elements",
            "Blockquote, Pre, Address tags",
          ],
        },
        {
          title: "Inline Elements",
          topics: [
            "Span, A, Strong, Em tags",
            "Small, Mark, Del, Ins tags",
            "Code, Kbd, Samp, Var tags",
            "Time, Progress, Meter elements",
          ],
        },
        {
          title: "Media Elements",
          topics: [
            "Video tag with controls and attributes",
            "Audio tag for sound integration",
            "Image tag with responsive attributes",
            "Picture element for responsive images",
            "Canvas for graphics and animations",
          ],
        },
        {
          title: "Forms",
          topics: [
            "Form tag and form structure",
            "Input types (text, email, password, etc.)",
            "Textarea, Select, Option elements",
            "Form validation attributes",
            "Label and Fieldset for accessibility",
          ],
        },
        {
          title: "Tables",
          topics: [
            "Table, Thead, Tbody, Tfoot structure",
            "Tr, Td, Th elements",
            "Table attributes and styling",
            "Responsive table techniques",
          ],
        },
        {
          title: "Semantic Elements",
          topics: [
            "Article, Section, Aside usage",
            "Header, Footer, Nav elements",
            "Main, Figure, Figcaption tags",
            "Time, Mark, Details, Summary elements",
          ],
        },
      ],
    },
    {
      id: "css",
      title: "CSS & Styling",
      icon: <FileTextOutlined />,
      color: "#1572b6",
      description: "Beautiful styling and responsive design",
      duration: "2 Weeks",
      level: "Beginner to Intermediate",
      syllabus: [
        {
          title: "Introduction to CSS",
          topics: [
            "What is CSS and its purpose",
            "CSS syntax and rules",
            "CSS versions and browser support",
            "CSS best practices and conventions",
          ],
        },
        {
          title: "Different Ways to Include CSS",
          topics: [
            "Inline CSS with style attribute",
            "Internal CSS with style tag",
            "External CSS with link tag",
            "Import CSS with @import rule",
            "CSS precedence and specificity",
          ],
        },
        {
          title: "CSS Selectors",
          topics: [
            "Element, Class, ID selectors",
            "Descendant and child selectors",
            "Attribute selectors",
            "Pseudo-classes and pseudo-elements",
            "Combinator selectors",
          ],
        },
        {
          title: "Font Properties",
          topics: [
            "Font-family and font stacks",
            "Font-size and font-weight",
            "Font-style and font-variant",
            "Line-height and letter-spacing",
            "Text decoration and transformation",
          ],
        },
        {
          title: "Google Fonts",
          topics: [
            "Importing Google Fonts",
            "Font loading performance",
            "Font display properties",
            "Custom font fallbacks",
          ],
        },
        {
          title: "Font Awesome Icons",
          topics: [
            "Including Font Awesome library",
            "Using icon classes",
            "Icon sizing and styling",
            "Custom icon integration",
          ],
        },
        {
          title: "Box Model",
          topics: [
            "Content, Padding, Border, Margin",
            "Box-sizing property",
            "Border properties and styles",
            "Margin collapse understanding",
          ],
        },
        {
          title: "Display Property",
          topics: [
            "Block, Inline, Inline-block",
            "None and visibility hidden",
            "Table display values",
            "Display: contents usage",
          ],
        },
        {
          title: "Display Flex",
          topics: [
            "Flexbox container properties",
            "Flex-direction and flex-wrap",
            "Justify-content and align-items",
            "Flex item properties",
            "Flex shorthand usage",
          ],
        },
        {
          title: "Media Queries",
          topics: [
            "Responsive design principles",
            "Breakpoint strategies",
            "Mobile-first approach",
            "Print and screen media types",
          ],
        },
        {
          title: "CSS Overflow",
          topics: [
            "Overflow: visible, hidden, scroll, auto",
            "Text-overflow and white-space",
            "Overflow-x and overflow-y",
            "Creating custom scrollbars",
          ],
        },
        {
          title: "Position Property",
          topics: [
            "Static, Relative, Absolute positioning",
            "Fixed and sticky positioning",
            "Z-index and stacking context",
            "Position-based layouts",
          ],
        },
        {
          title: "Colors, Units, Variables",
          topics: [
            "Color formats: hex, rgb, hsl",
            "CSS units: px, em, rem, %",
            "Viewport units: vw, vh, vmin, vmax",
            "CSS custom properties (variables)",
          ],
        },
        {
          title: "SCSS (Sass)",
          topics: [
            "SCSS syntax and features",
            "Variables and nesting",
            "Mixins and functions",
            "Partials and imports",
            "Build tools integration",
          ],
        },
      ],
    },
    {
      id: "javascript",
      title: "JavaScript",
      icon: <JavaScriptOutlined />,
      color: "#f7df1e",
      description: "Programming language of the web",
      duration: "3 Weeks",
      level: "Intermediate",
      syllabus: [
        {
          title: "JavaScript Basics",
          topics: [
            "Introduction to JavaScript",
            "Variables and Data Types",
            "Operators and Expressions",
            "Control Structures (if/else, loops)",
            "Functions and Scope",
            "Objects and Arrays",
            "Error Handling Basics",
          ],
        },
        {
          title: "Advanced JavaScript",
          topics: [
            "ES6+ Features (Arrow Functions, Destructuring)",
            "Asynchronous JavaScript (Promises, Async/Await)",
            "DOM Manipulation and Events",
            "Event Handling and Delegation",
            "JavaScript Modules and Imports",
            "Local Storage and Session Storage",
            "Fetch API and AJAX Requests",
          ],
        },
      ],
    },
    {
      id: "react",
      title: "React.js",
      icon: <AppstoreOutlined />,
      color: "#61dafb",
      description: "Modern JavaScript library for building UIs",
      duration: "3 Weeks",
      level: "Intermediate to Advanced",
      syllabus: [
        {
          title: "React Fundamentals",
          topics: [
            "Introduction to React and JSX",
            "Components (Functional vs Class)",
            "Props and State Management",
            "Event Handling in React",
            "Conditional Rendering",
            "Lists and Keys",
            "Forms and Controlled Components",
          ],
        },
        {
          title: "Advanced React Concepts",
          topics: [
            "React Hooks (useState, useEffect, useContext)",
            "Context API for State Management",
            "React Router for Navigation",
            "Higher Order Components (HOCs)",
            "Error Boundaries and Error Handling",
            "Performance Optimization",
            "Testing React Components",
          ],
        },
        {
          title: "React Ecosystem",
          topics: [
            "State Management with Redux",
            "API Integration with Axios",
            "Build Tools and Deployment",
            "React Best Practices",
            "Code Splitting and Lazy Loading",
            "Progressive Web Apps (PWA)",
            "Server-Side Rendering (SSR) Basics",
          ],
        },
      ],
    },
    {
      id: "backend",
      title: "Rest Apis",
      icon: <DatabaseOutlined />,
      color: "#68217a",
      description: "Server-side development with Node.js & MongoDB",
      duration: "2 Weeks",
      level: "Advanced",
      syllabus: [
        {
          title: "Node.js Fundamentals",
          topics: [
            "Introduction to Node.js Runtime",
            "Core Modules and NPM",
            "Asynchronous Programming",
            "File System Operations",
            "HTTP Server Creation",
            "Event-Driven Architecture",
            "Debugging Node.js Applications",
          ],
        },
        {
          title: "Express.js Framework",
          topics: [
            "Express.js Setup and Configuration",
            "Routing and Middleware",
            "RESTful API Development",
            "Error Handling and Validation",
            "Authentication and Authorization",
            "Security Best Practices",
            "API Testing and Documentation",
          ],
        },
        {
          title: "Database Integration",
          topics: [
            "Introduction to MongoDB",
            "Database Design and Modeling",
            "CRUD Operations",
            "Mongoose ODM",
            "Database Relationships",
            "Data Validation and Sanitization",
            "Performance Optimization",
          ],
        },
      ],
    },
    {
      id: "project",
      title: "Real-Time Project",
      icon: <ProjectOutlined />,
      color: "#ff6b6b",
      description: "Complete full-stack application development",
      duration: "2 Weeks",
      level: "Advanced",
      syllabus: [
        {
          title: "Project Planning & Setup",
          topics: [
            "Project Requirements Analysis",
            "Technology Stack Selection",
            "Project Architecture Design",
            "Development Environment Setup",
            "Version Control with Git",
            "Project Structure Organization",
            "Deployment Strategy Planning",
          ],
        },
        {
          title: "Full-Stack Development",
          topics: [
            "Frontend Development with React",
            "Backend API Development",
            "Database Design and Implementation",
            "User Authentication System",
            "Real-time Features Implementation",
            "File Upload and Management",
            "Payment Integration (if applicable)",
          ],
        },
        {
          title: "Testing & Deployment",
          topics: [
            "Unit and Integration Testing",
            "Code Quality and Review",
            "Performance Optimization",
            "Security Implementation",
            "Production Deployment",
            "CI/CD Pipeline Setup",
            "Monitoring and Maintenance",
          ],
        },
      ],
    },
  ];

  const courseHighlights = [
    {
      icon: <CheckCircleOutlined />,
      title: "Industry-Ready Skills",
      desc: "Learn technologies used by top companies",
    },
    {
      icon: <UserOutlined />,
      title: "Personal Mentorship",
      desc: "One-on-one guidance from experienced trainer",
    },
    {
      icon: <ProjectOutlined />,
      title: "Real Projects",
      desc: "Build portfolio-worthy applications",
    },
    {
      icon: <TrophyOutlined />,
      title: "Job Assistance",
      desc: "Career guidance and interview preparation",
    },
  ];

  const learningPhases = [
    {
      phase: "Foundation Phase",
      duration: "Weeks 1-3",
      icon: <BookOutlined />,
      color: "#52c41a",
      description:
        "Build strong fundamentals with HTML, CSS, and basic styling",
      skills: [
        "HTML5 Semantic Structure",
        "CSS Styling & Layouts",
        "Responsive Design",
        "SCSS Preprocessing",
      ],
      projects: ["Personal Portfolio Website", "Responsive Landing Page"],
    },
    {
      phase: "Programming Phase",
      duration: "Weeks 4-6",
      icon: <CodeOutlined />,
      color: "#1890ff",
      description: "Master JavaScript programming and DOM manipulation",
      skills: [
        "JavaScript ES6+",
        "DOM Manipulation",
        "Event Handling",
        "Async Programming",
      ],
      projects: ["Interactive Web Applications", "JavaScript Games"],
    },
    {
      phase: "Framework Phase",
      duration: "Weeks 7-9",
      icon: <AppstoreOutlined />,
      color: "#722ed1",
      description: "Build modern UIs with React.js and state management",
      skills: [
        "React Components",
        "State Management",
        "React Hooks",
        "React Router",
      ],
      projects: ["Single Page Applications", "E-commerce Frontend"],
    },
    {
      phase: "Backend Phase",
      duration: "Weeks 10-11",
      icon: <DatabaseOutlined />,
      color: "#fa541c",
      description: "Develop server-side applications and APIs",
      skills: [
        "Node.js Runtime",
        "Express.js Framework",
        "MongoDB Database",
        "API Development",
      ],
      projects: ["RESTful APIs", "Authentication Systems"],
    },
    {
      phase: "Integration Phase",
      duration: "Week 12",
      icon: <RocketOutlined />,
      color: "#eb2f96",
      description: "Complete full-stack project with deployment",
      skills: [
        "Full-Stack Integration",
        "Deployment",
        "Testing",
        "Performance Optimization",
      ],
      projects: ["Complete MERN Stack Application", "Portfolio Project"],
    },
  ];

  const trainerInfo = {
    name: "Jayanth Babu Somineni",
    title: "Senior Front-End Developer & Passionate Trainer",
    experience: "9+ Years",
    startedYear: "2015",
    description:
      "Hello! I'm Jayanth, a front-end web developer with a passion for creating beautiful and functional websites. With expertise in modern web technologies like React, JavaScript, and CSS, I enjoy turning complex problems into simple, intuitive, and aesthetic web solutions.",
    journey:
      "My journey into web development began in 2015, driven by my curiosity about how websites are built and how they function. Since then, I've been constantly learning and growing in the field, keeping up with the latest trends and technologies.",
    specializations: [
      "Web Development",
      "UI/UX Design",
      "JavaScript Programming",
      "React Development",
      "Responsive Design",
      "Modern CSS",
    ],
    achievements: [
      {
        title: "Medium Writer",
        icon: <EditOutlined />,
        color: "#00ab6c",
        link: "https://medium.com/@jsomineni",
      },
      {
        title: "BuiltIn Author",
        icon: <FireOutlined />,
        color: "#ff6b35",
        link: "https://builtin.com/authors/jayanth-somineni",
      },
      {
        title: "GitHub Contributor",
        icon: <GithubOutlined />,
        color: "#333",
        link: "https://github.com/jayanthbabu123",
      },
      {
        title: "100+ Students Trained",
        icon: <HeartOutlined />,
        color: "#e91e63",
        link: null,
      },
    ],
    contact: {
      email: "jsomineni@gmail.com",
      linkedin: "https://www.linkedin.com/in/jayanth-babu-somineni/",
      github: "https://github.com/jayanthbabu123",
      medium: "https://medium.com/@jsomineni",
      builtin: "https://builtin.com/authors/jayanth-somineni",
    },
  };

  const handleCardClick = (tech) => {
    setSelectedTech(tech);
    setModalVisible(true);
  };

  const handleEnrollNowClick = () => {
    navigate("/login");
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedTech(null);
  };

  return (
    <div className="syllabus-page">
      {/* Sticky Banner */}
      <div className="sticky-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <strong>New Batch Starting Soon:</strong> 12-Week MERN Stack
              Bootcamp with Job Placement Assistance
            </div>
            <Button
              type="primary"
              onClick={handleContactModalOpen}
              className="banner-button"
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="syllabus-hero">
        <div className="hero-background"></div>
        <div className="section-divider-top"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <ClockCircleOutlined /> Fast-Track 12-Week Web Development
              Bootcamp
            </div>
            <Title level={1} className="hero-title">
              12-Week Web Development Bootcamp
            </Title>
            <Paragraph className="hero-description">
              Intensive MERN Stack training from HTML basics to advanced React
              development. Build 5+ real-world projects and become a job-ready
              full-stack developer in just 12 weeks.
            </Paragraph>

            <div className="hero-action-buttons">
              <Button
                type="primary"
                size="large"
                onClick={handleContactModalOpen}
                className="enroll-button"
                icon={<RocketOutlined />}
              >
                Enroll Now - Free Demo Available
              </Button>
              <Button
                size="large"
                onClick={() => setContactModalVisible(true)}
                className="contact-button"
                icon={<MailOutlined />}
              >
                Contact Us
              </Button>
            </div>

            <Row gutter={[32, 16]} className="hero-stats">
              <Col xs={12} sm={6}>
                <div className="hero-stat">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Technologies</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="hero-stat">
                  <div className="stat-number">16</div>
                  <div className="stat-label">Weeks Training</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="hero-stat">
                  <div className="stat-number">5+</div>
                  <div className="stat-label">Live Projects</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="hero-stat">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Practical</div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      {/* About Trainer Section */}
      <section className="trainer-section">
        <div className="section-divider-top"></div>
        <div className="container">
          {/* Meet Your Trainer Section */}
          <section className="trainer-section">
            <div className="container">
              <div className="section-header text-center">
                <h2 className="section-title">Meet Your Instructor</h2>
                <p className="section-description">
                  Learn from an industry expert with real-world experience
                </p>
              </div>

              <Row gutter={[30, 20]} align="top" className="trainer-container">
                <Col xs={24} md={9} className="text-center">
                  <div className="trainer-card">
                    <div className="trainer-image-wrapper">
                      <div className="avatar-circle">
                        <img
                          src="https://programwithjayanth.com/images/profile.jpg"
                          width="140"
                          height="140"
                          className="trainer-avatar"
                          alt="Jayanth Somineni"
                        />
                      </div>
                    </div>

                    <Title level={5} className="trainer-name">
                      Jayanth Somineni
                    </Title>
                    <div className="trainer-title">
                      Senior Software Developer & Trainer
                    </div>

                    <div className="trainer-stats">
                      <div className="stat-item">
                        <div className="stat-value">100+</div>
                        <div className="stat-label">Students</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">10+</div>
                        <div className="stat-label">Years</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">50+</div>
                        <div className="stat-label">Projects</div>
                      </div>
                    </div>

                    <div className="social-links">
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<LinkedinOutlined />}
                        href={trainerInfo.contact.linkedin}
                        target="_blank"
                        className="social-btn linkedin-btn"
                      />
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<GithubOutlined />}
                        href={trainerInfo.contact.github}
                        target="_blank"
                        className="social-btn github-btn"
                      />
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined />}
                        href={trainerInfo.contact.medium}
                        target="_blank"
                        className="social-btn medium-btn"
                      />
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<MailOutlined />}
                        onClick={() => setContactModalVisible(true)}
                        className="social-btn email-btn"
                      />
                    </div>

                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<PhoneOutlined />}
                      onClick={handleContactModalOpen}
                      className="connect-btn"
                    >
                      Schedule a Free Session
                    </Button>
                  </div>
                </Col>

                <Col xs={24} md={15}>
                  <Card className="trainer-info-card">
                    <div className="trainer-bio">
                      <Title level={4}>About Your Instructor</Title>
                      <Paragraph>
                        Hi, I'm Jayanth - a Senior Software Developer and
                        educator with over 10 years of experience in web
                        development. I specialize in the MERN stack and have
                        helped more than 100 students transition into tech
                        careers through my practical, project-based teaching
                        approach.
                      </Paragraph>
                      <Paragraph>
                        I believe in teaching not just syntax, but real-world
                        problem-solving and industry best practices that will
                        make you job-ready. My 12-week intensive program is
                        designed to take you from beginner to professional
                        developer with hands-on projects and personalized
                        feedback.
                      </Paragraph>
                    </div>

                    <Divider />

                    <div className="specializations-section">
                      <Title level={4}>My Expertise</Title>
                      <div className="specializations">
                        {trainerInfo.specializations.map((spec, index) => (
                          <Tag key={index} className="spec-tag" color="blue">
                            {spec}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <Divider />

                    <div className="achievements-section">
                      <Title level={4}>Career Highlights</Title>
                      <Timeline>
                        <Timeline.Item color="blue">
                          <Text strong>Trained 100+ Students</Text>
                          <p>
                            Helping professionals transition to successful tech
                            careers
                          </p>
                        </Timeline.Item>
                        <Timeline.Item color="green">
                          <Text strong>Senior Software Developer</Text>
                          <p>
                            10+ years of professional development experience
                          </p>
                        </Timeline.Item>
                        <Timeline.Item color="red">
                          <Text strong>Technical Author</Text>
                          <p>
                            Published on Medium, BuiltIn and other tech
                            platforms
                          </p>
                        </Timeline.Item>
                        <Timeline.Item color="purple">
                          <Text strong>Industry Expert</Text>
                          <p>
                            Specialized in modern web technologies and
                            frameworks
                          </p>
                        </Timeline.Item>
                      </Timeline>
                    </div>

                    <div className="text-center mt-4">
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleContactModalOpen}
                      >
                        Book Your Free Demo Session
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </section>
        </div>
      </section>

      {/* Course Highlights */}
      <section className="course-highlights">
        <div className="section-divider-top"></div>
        <div className="container">
          <Row gutter={[24, 24]}>
            {courseHighlights.map((highlight, index) => (
              <Col xs={12} md={6} key={index}>
                <div className="highlight-card">
                  <div className="highlight-icon">{highlight.icon}</div>
                  <Title level={5} className="highlight-title">
                    {highlight.title}
                  </Title>
                  <Text className="highlight-desc">{highlight.desc}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="technologies-section">
        <div className="section-divider-top"></div>
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Technologies You'll Master
            </Title>
            <Paragraph className="section-description">
              Click on any technology to explore the detailed curriculum and
              learning outcomes
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {technologies.map((tech) => (
              <Col xs={24} md={12} lg={8} key={tech.id}>
                <Card
                  className="tech-card"
                  onClick={() => handleCardClick(tech)}
                  hoverable
                >
                  <div className="tech-card-header">
                    <div className="tech-icon" style={{ color: tech.color }}>
                      {tech.icon}
                    </div>
                    <div className="tech-info">
                      <Title level={4} className="tech-title">
                        {tech.title}
                      </Title>
                      <Text className="tech-description">
                        {tech.description}
                      </Text>
                    </div>
                  </div>

                  <div className="tech-meta">
                    <Tag color="blue">{tech.duration}</Tag>
                    <Tag color="green">{tech.level}</Tag>
                  </div>

                  <Button
                    type="primary"
                    size="small"
                    className="view-details-btn"
                    style={{ marginTop: 16 }}
                  >
                    View Details
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Enhanced Learning Journey */}
      <section className="learning-journey">
        <div className="section-divider-top"></div>
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Your Learning Journey
            </Title>
            <Paragraph className="section-description">
              A structured 16-week program designed to transform you from
              beginner to professional developer
            </Paragraph>
          </div>

          <div className="learning-phases">
            {learningPhases.map((phase, index) => (
              <div key={index} className="phase-card">
                <div className="phase-header">
                  <div
                    className="phase-icon"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.icon}
                  </div>
                  <div className="phase-info">
                    <Title level={4} className="phase-title">
                      {phase.phase}
                    </Title>
                    <Tag color={phase.color}>{phase.duration}</Tag>
                  </div>
                </div>

                <Paragraph className="phase-description">
                  {phase.description}
                </Paragraph>

                <div className="phase-content">
                  <div className="skills-section">
                    <Title level={5}>Key Skills</Title>
                    <div className="skills-list">
                      {phase.skills.map((skill, skillIndex) => (
                        <Tag key={skillIndex} className="skill-tag">
                          <StarOutlined /> {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div className="projects-section">
                    <Title level={5}>Practice Projects</Title>
                    <List
                      size="small"
                      dataSource={phase.projects}
                      renderItem={(project) => (
                        <List.Item>
                          <CheckCircleOutlined className="project-icon" />
                          {project}
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="section-divider-top"></div>
        <div className="cta-background"></div>
        <div className="container">
          <div className="cta-content">
            <Title level={3} className="cta-title">
              Ready to start your journey?
            </Title>
            <Paragraph className="cta-description">
              Join our 12-week bootcamp and become a professional in web
              development
            </Paragraph>
            <div className="cta-buttons">
              <Button
                type="primary"
                size="large"
                onClick={handleContactModalOpen}
                icon={<ArrowRightOutlined />}
                className="cta-button-primary"
              >
                Start Your 12-Week Journey
              </Button>
              <Button
                type="default"
                size="large"
                className="cta-button-secondary ml-3"
                onClick={() => setContactModalVisible(true)}
                icon={<PhoneOutlined />}
              >
                Schedule a Free Demo Class
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Details Modal */}
      <Modal
        title={
          <div className="modal-header">
            <div
              className="modal-tech-icon"
              style={{ color: selectedTech?.color }}
            >
              {selectedTech?.icon}
            </div>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {selectedTech?.title} Curriculum
              </Title>
              <Space>
                <Tag color="blue">{selectedTech?.duration}</Tag>
                <Tag color="green">{selectedTech?.level}</Tag>
              </Space>
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
          <Button key="enroll" type="primary" onClick={handleContactModalOpen}>
            Enroll Now
          </Button>,
        ]}
        width={800}
        className="tech-modal"
      >
        {selectedTech && (
          <div className="modal-content">
            <Paragraph className="tech-modal-description">
              {selectedTech.description}
            </Paragraph>

            <Divider />

            <div className="syllabus-content">
              {selectedTech.syllabus.map((section, sectionIndex) => (
                <div key={sectionIndex} className="syllabus-section">
                  <Title level={4} className="section-title">
                    {section.title}
                  </Title>
                  <List
                    dataSource={section.topics}
                    renderItem={(topic, topicIndex) => (
                      <List.Item key={topicIndex} className="topic-item">
                        <List.Item.Meta
                          avatar={
                            <CheckCircleOutlined className="topic-icon" />
                          }
                          title={topic}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Contact Us Modal */}
      <ContactModal
        isOpen={contactModalVisible || enrollModalVisible}
        onClose={() => {
          setContactModalVisible(false);
          setEnrollModalVisible(false);
        }}
        courseInfo={
          selectedTech
            ? {
                id: selectedTech.id,
                title: selectedTech.title,
              }
            : null
        }
      />

      {/* Comprehensive Course Section */}
      <div className="comprehensive-course-section">
        <div className="section-divider-top"></div>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">12-Week Bootcamp Highlights</h2>
            <p className="section-description">
              Everything you need to transform from a beginner to a job-ready
              developer in just 12 weeks
            </p>
          </div>

          <Row gutter={[24, 24]} className="mb-5">
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-icon">
                  <CodeOutlined />
                </div>
                <Title level={4}>Hands-on Projects</Title>
                <Text>
                  Build 5+ real-world applications during the 12-week program to
                  showcase in your portfolio
                </Text>
                <div className="mt-3">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-icon">
                  <TrophyOutlined />
                </div>
                <Title level={4}>Mock Interviews</Title>
                <Text>
                  Week 11-12: Practice with real interview questions and get
                  personalized feedback
                </Text>
                <div className="mt-3">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-icon">
                  <UserOutlined />
                </div>
                <Title level={4}>Interview Assistance</Title>
                <Text>
                  Final weeks: Get help with resume building, LinkedIn profile,
                  and job applications
                </Text>
                <div className="mt-3">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-icon">
                  <BookOutlined />
                </div>
                <Title level={4}>Comprehensive Materials</Title>
                <Text>
                  Weekly materials: Access to code repositories, learning
                  resources, and documentation
                </Text>
                <div className="mt-3">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-icon">
                  <RocketOutlined />
                </div>
                <Title level={4}>Career Growth</Title>
                <Text>
                  Week 12: Personalized guidance on career advancement and skill
                  development roadmap
                </Text>
                <div className="mt-3">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-icon">
                  <FireOutlined />
                </div>
                <Title level={4}>Industry Expertise</Title>
                <Text>
                  Throughout 12 weeks: Learn the latest industry practices and
                  technologies in demand
                </Text>
                <div className="mt-3">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-4 mb-5">
            <Button
              type="primary"
              size="large"
              onClick={handleContactModalOpen}
              icon={<ArrowRightOutlined />}
            >
              Join Our 12-Week Developer Bootcamp
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="section-divider-top"></div>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Student Success Stories</h2>
            <p className="section-description">
              See what our students have to say about their learning journey
            </p>
          </div>

          <Row gutter={[24, 24]} className="mb-5">
            <Col xs={24} md={8}>
              <Card className="testimonial-card" hoverable>
                <div className="testimonial-avatar">
                  <Avatar size={80} icon={<UserOutlined />} />
                </div>
                <Title level={4} className="testimonial-name">
                  Priya Sharma
                </Title>
                <Text type="secondary" className="testimonial-title">
                  Frontend Developer at TechCorp
                </Text>
                <Rate
                  disabled
                  defaultValue={5}
                  className="testimonial-rating"
                />
                <Paragraph className="testimonial-text">
                  "The 12-week bootcamp was exceptional! I went from knowing
                  nothing about coding to landing a job as a frontend developer.
                  The hands-on projects and interview preparation in the final
                  weeks made all the difference."
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="testimonial-card" hoverable>
                <div className="testimonial-avatar">
                  <Avatar size={80} icon={<UserOutlined />} />
                </div>
                <Title level={4} className="testimonial-name">
                  Rahul Patel
                </Title>
                <Text type="secondary" className="testimonial-title">
                  Full Stack Developer at StartupX
                </Text>
                <Rate
                  disabled
                  defaultValue={5}
                  className="testimonial-rating"
                />
                <Paragraph className="testimonial-text">
                  "Jayanth's 12-week program is practical and industry-focused.
                  I especially appreciated the real-time project experience in
                  weeks 7-12 which helped me build a strong portfolio that
                  impressed my interviewers."
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="testimonial-card" hoverable>
                <div className="testimonial-avatar">
                  <Avatar size={80} icon={<UserOutlined />} />
                </div>
                <Title level={4} className="testimonial-name">
                  Neha Gupta
                </Title>
                <Text type="secondary" className="testimonial-title">
                  Web Developer at InnovateTech
                </Text>
                <Rate
                  disabled
                  defaultValue={5}
                  className="testimonial-rating"
                />
                <Paragraph className="testimonial-text">
                  "Coming from a non-technical background, I was nervous about
                  learning to code. The 12-week structured curriculum with
                  step-by-step approach and continuous support made it possible
                  for me to transition to a tech career successfully."
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-4 mb-5">
            <Button
              type="primary"
              onClick={handleContactModalOpen}
              size="large"
              icon={<ArrowRightOutlined />}
            >
              Join Our 12-Week Bootcamp - Enroll Today
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="section-divider-top"></div>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Get answers to your questions about our courses and training
              programs
            </p>
          </div>

          <Row gutter={[24, 24]} className="mb-5">
            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={5}>What is the course duration?</Title>
                <Paragraph>
                  Our comprehensive Web Development Bootcamp is a focused
                  12-week program with structured learning paths. We offer
                  flexible scheduling options to accommodate different time
                  zones and work schedules.
                </Paragraph>
                <div className="text-right">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Ask more
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={5}>Do I need prior programming experience?</Title>
                <Paragraph>
                  No prior experience is required. Our courses are designed from
                  the ground up, starting with the fundamentals. We'll guide you
                  through every step of your learning journey.
                </Paragraph>
                <div className="text-right">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Ask more
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={5}>
                  What kind of job assistance do you provide?
                </Title>
                <Paragraph>
                  In the final weeks of our 12-week program, we offer resume
                  building, LinkedIn profile optimization, mock interviews, and
                  technical interview preparation. Our goal is to make you
                  job-ready with both technical skills and interview confidence.
                </Paragraph>
                <div className="text-right">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Ask more
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={5}>
                  What projects will I build during the course?
                </Title>
                <Paragraph>
                  Throughout the 12-week program, you'll build real-world
                  projects including e-commerce websites, social media
                  applications, and interactive dashboards. These projects will
                  form your professional portfolio to showcase to potential
                  employers.
                </Paragraph>
                <div className="text-right">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Ask more
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={5}>How are the classes conducted?</Title>
                <Paragraph>
                  Our 12-week program includes online classes with live
                  instruction, interactive coding sessions, and real-time
                  feedback. We follow a structured curriculum with clear weekly
                  goals, and all sessions are recorded so you can review them at
                  your convenience.
                </Paragraph>
                <div className="text-right">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Ask more
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={5}>Can I get a free demo class?</Title>
                <Paragraph>
                  Yes, we offer free demo sessions to help you understand our
                  teaching methodology and course content. Contact us to
                  schedule your free demo class today.
                </Paragraph>
                <div className="text-right">
                  <Button type="link" onClick={handleContactModalOpen}>
                    Ask more
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-4 mb-5">
            <Title level={5}>Still have questions?</Title>
            <Button
              type="primary"
              size="large"
              onClick={handleContactModalOpen}
              icon={<MessageOutlined />}
              className="mt-3"
            >
              Join Our 12-Week Bootcamp Today
            </Button>
          </div>
        </div>
      </div>

      {/* Inject custom styles */}
      <style>{heroButtonStyles}</style>
      <style>{floatingButtonStyles}</style>
      <style>{`
        .section-divider-top {
          height: 3px;
          background: linear-gradient(90deg, rgba(24,144,255,0.1) 0%, rgba(24,144,255,0.4) 50%, rgba(24,144,255,0.1) 100%);
          margin-bottom: 20px;
        }

        .comprehensive-course-section {
          padding: 25px 0;
          background-color: #f8f9fa;
        }

        .feature-card {
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.09);
        }

        .feature-icon {
          font-size: 36px;
          color: #1890ff;
          margin-bottom: 16px;
        }

        .mt-3 {
          margin-top: 16px;
        }

        .mb-5 {
          margin-bottom: 32px;
        }

        .text-center {
          text-align: center;
        }

        .faq-section {
          padding: 25px 0;
          background-color: #fff;
        }

        .faq-card {
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .faq-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .text-right {
          text-align: right;
        }

        .sticky-banner {
          position: sticky;
          top: 0;
          background: linear-gradient(90deg, #1890ff, #096dd9);
          color: white;
          padding: 10px 0;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .banner-text {
          font-size: 16px;
        }

        .banner-button {
          margin-left: 20px;
          background: white;
          color: #1890ff;
          border: none;
          font-weight: 600;
        }

        .banner-button:hover {
          background: #f0f0f0;
          color: #096dd9;
        }

        @media (max-width: 768px) {
          .banner-content {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .banner-button {
            margin-left: 0;
          }
        }

        .testimonials-section {
          padding: 25px 0;
          background-color: #f0f7ff;
          position: relative;
          overflow: hidden;
        }

        .trainer-section {
          padding: 25px 0;
          background-color: #f8f9fa;
          position: relative;
          overflow: hidden;
        }

        .trainer-container {
          margin-top: 15px;
        }

        .trainer-card {
          background-color: white;
          border-radius: 12px;
          padding: 20px 15px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          height: 100%;
        }

        .trainer-image-wrapper {
          position: relative;
          margin-bottom: 20px;
          display: inline-block;
        }

        .avatar-circle {
          background: linear-gradient(135deg, #f0f7ff, #e6f7ff);
          width: 150px;
          height: 150px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }

        .trainer-avatar {
          border: 4px solid white;
          border-radius: 50%;
          object-fit: cover;
        }

        .trainer-name {
          margin-bottom: 0 !important;
          margin-top: 10px !important;
          font-weight: 500;
          font-size: 0.85rem;
        }

        .trainer-title {
          color: #666;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .trainer-stats {
          display: flex;
          justify-content: center;
          margin: 15px 0;
          gap: 16px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-weight: bold;
          font-size: 18px;
          color: #1890ff;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .social-btn {
          width: 32px;
          height: 32px;
          border-radius: 50% !important;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          font-size: 14px;
          padding: 0;
          border: none;
        }

        .linkedin-btn {
          background-color: #0077b5;
          color: white;
          border: none;
        }

        .github-btn {
          background-color: #333;
          color: white;
          border: none;
        }

        .medium-btn {
          background-color: #00ab6c;
          color: white;
          border: none;
        }

        .email-btn {
          background-color: #ff5722;
          color: white;
          border: none;
        }

        .social-btn:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          color: white;
        }

        .connect-btn {
          margin-top: 10px;
          height: 36px;
          border-radius: 4px;
          font-weight: 500;
          background: linear-gradient(90deg, #1890ff, #096dd9);
          border: none;
          box-shadow: 0 4px 8px rgba(24, 144, 255, 0.15);
        }

        .trainer-info-card {
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          height: 100%;
          padding: 20px;
          margin-top: 0;
        }

        .trainer-bio {
          margin-bottom: 20px;
          margin-top: 0;
        }

        .specializations-section {
          margin-bottom: 20px;
        }

        .specializations {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 15px;
        }

        .spec-tag {
          padding: 6px 12px;
          font-size: 14px;
          border-radius: 20px;
        }

        .achievements-section {
          margin-top: 20px;
        }

        .testimonials-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #1890ff, #096dd9);
        }

        .testimonial-card {
          height: 100%;
          text-align: center;
          padding: 30px 20px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.07);
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .testimonial-avatar {
          margin: 0 auto 16px;
        }

        .testimonial-name {
          margin-bottom: 4px !important;
        }

        .testimonial-title {
          display: block;
          margin-bottom: 12px;
        }

        .testimonial-rating {
          margin-bottom: 16px;
          font-size: 16px;
        }

        .testimonial-text {
          font-style: italic;
        }
      `}</style>

      {/* Floating Contact Button */}
      <Button
        className="floating-contact-btn"
        onClick={() => setContactModalVisible(true)}
        icon={<MailOutlined />}
        title="Contact Us"
      />
    </div>
  );
};

export default Syllabus;
export { Syllabus };
