import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCallback } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Statistic,
  Avatar,
  Rate,
  Divider,
} from "antd";
import {
  BookOutlined,
  VideoCameraOutlined,
  LaptopOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const { Title, Paragraph, Text } = Typography;

const features = [
  {
    emoji: "👨‍🏫",
    title: "Expert Training",
    desc: "Learn from an experienced trainer with proven track record",
  },
  {
    emoji: "👥",
    title: "Batch Learning",
    desc: "Join structured batches with focused learning paths",
  },
  {
    emoji: "📱",
    title: "Flexible Learning",
    desc: "Access training materials and sessions anytime",
  },
  {
    emoji: "🎯",
    title: "Personal Attention",
    desc: "Get individual feedback and guidance",
  },
];

const benefits = [
  {
    title: "For Students",
    items: [
      "Personalized learning experience",
      "Regular one-on-one mentoring sessions",
      "Access to recorded sessions and materials",
      "Project portfolio development",
      "Career guidance and support",
      "Community learning environment",
    ],
  },
  {
    title: "Training Approach",
    items: [
      "Hands-on practical training",
      "Industry-relevant curriculum",
      "Regular doubt clearing sessions",
      "Mock interviews and assessments",
      "Resume building workshops",
      "Placement assistance",
    ],
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Full Stack Developer",
    content:
      "The training sessions were incredibly helpful. The practical approach and personal attention helped me land my dream job.",
    avatar: "👨",
  },
  {
    name: "Priya Patel",
    role: "Frontend Developer",
    content:
      "The structured learning path and regular assessments kept me on track. The project-based approach gave me real-world experience.",
    avatar: "👩",
  },
  {
    name: "Amit Kumar",
    role: "Backend Developer",
    content:
      "The mentorship and guidance were invaluable. The mock interviews and resume workshops helped me prepare for job opportunities.",
    avatar: "👨",
  },
];

const stats = [
  { number: "500+", label: "Active Students" },
  { number: "10+", label: "Training Batches" },
  { number: "98%", label: "Student Satisfaction" },
  { number: "85%", label: "Placement Rate" },
];

const technologies = [
  {
    name: "HTML5",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    description: "Master modern HTML5 for building robust web structures",
  },
  {
    name: "CSS3",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    description: "Create stunning designs with advanced CSS3 features",
  },
  {
    name: "JavaScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    description: "Learn JavaScript fundamentals and modern ES6+ features",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    description: "Build dynamic user interfaces with React.js",
  },
  {
    name: "Node.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    description: "Develop scalable backend applications with Node.js",
  },
  {
    name: "Express",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    description: "Create robust APIs using Express.js framework",
  },
  {
    name: "MongoDB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    description: "Work with MongoDB for flexible data storage",
  },
  {
    name: "Git",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    description: "Master version control and collaboration with Git",
  },
];

const courseBenefits = [
  {
    title: "Free Trial Classes",
    description:
      "Start with 7 free classes to experience the quality of training",
    icon: "🎯",
    highlight: "7 Free Classes",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "No-Risk Learning",
    description: "Leave anytime if you don't find the training valuable",
    icon: "🛡️",
    highlight: "Money-Back Guarantee",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Daily Recordings",
    description: "Access recordings of all classes for revision and catch-up",
    icon: "🎥",
    highlight: "Lifetime Access",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Comprehensive Notes",
    description: "Get detailed notes and study materials for each topic",
    icon: "📝",
    highlight: "Daily Updates",
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Practical Assignments",
    description: "Hands-on assignments to reinforce your learning",
    icon: "💻",
    highlight: "Real-World Projects",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Interview Preparation",
    description: "Regular mock interviews and interview guidance sessions",
    icon: "🎯",
    highlight: "Mock Interviews",
    color: "from-red-500 to-red-600",
  },
  {
    title: "Live Projects",
    description: "Work on real-time projects to build your portfolio",
    icon: "🚀",
    highlight: "Industry Projects",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Career Support",
    description: "Get guidance on resume building and job search",
    icon: "💼",
    highlight: "Placement Assistance",
    color: "from-teal-500 to-teal-600",
  },
];

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCTANavigate = useCallback(
    (path) => {
    if (currentUser) {
      navigate(path);
    } else {
        navigate("/login");
    }
    },
    [currentUser, navigate]
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section with background and nav overlay */}
      <section className="hero-section position-relative min-vh-100 text-white overflow-hidden">
        {/* Nav inside hero section, overlaying background */}
        <nav className="navbar-hero container">
          <Link to="/" className="navbar-brand">
            <span className="brand-logo">
              Train With <span className="blue">Jayanth</span>
            </span>
          </Link>
          <div className="navbar-links">
            {currentUser ? (
              <>
                <Link to="/student/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/student/courses" className="nav-link">
                  My Courses
                </Link>
                <Link to="/student/assignments" className="nav-link">
                  Assignments
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                {/* <Link to="/signup" className="nav-link">
                  Sign Up
                </Link> */}
              </>
            )}
          </div>
        </nav>
        {/* SVG pattern is handled by CSS ::before */}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="hero-content-row">
            {/* Left Side */}
            <div className="hero-left-content">
              {/* <div className="hero-badge"><b>👋 Welcome to Train With Jayanth</b></div> */}
              <div className="hero-title-gradient">
                Learn & Grow with
                <br />
                Personalized Training
              </div>
              <div className="hero-description-main">
                Join my training sessions to master new skills, get personalized
                guidance, and achieve your learning goals with expert
                mentorship.
              </div>
              <div className="hero-description-secondary">
                You can attend 7 classes for free to decide if you want to
                continue.
        </div>
              <div className="hero-stats-row">
                <div className="hero-stat">
                  <div className="hero-stat-value">500+</div>
                  <div className="hero-stat-label">Active Students</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">10+</div>
                  <div className="hero-stat-label">Training Batches</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">98%</div>
                  <div className="hero-stat-label">Student Satisfaction</div>
                </div>
              </div>
              <div style={{ height: 32 }} />
              <div style={{ display: "flex", gap: "1.5rem", marginBottom: 32 }}>
                <Button
                  type="primary"
                  className="hero-button-primary"
                  size="large"
                  onClick={() =>
                    handleCTANavigate(
                      currentUser ? "/student/assignments" : "/login"
                    )
                  }
                >
                  Start Learning
                </Button>
                <Button
                  className="hero-button-secondary"
                  size="large"
                  onClick={() =>
                    handleCTANavigate(
                      currentUser ? "/student/courses" : "/login"
                    )
                  }
                >
                  View My Courses
                </Button>
                </div>
                </div>
            {/* Right Side: Feature Cards */}
            <div className="hero-right-content">
              <div className="feature-cards">
                {features.map((f, i) => (
                  <div className="feature-card" key={i}>
                    <div className="feature-emoji">{f.emoji}</div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <div className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="tech-section-title">
              Technologies You'll Master
            </span>
            <div className="tech-section-desc">
              A comprehensive curriculum covering the most in-demand
              technologies in web development
            </div>
          </div>
          <Row gutter={[32, 32]}>
            {technologies.map((tech, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div className="tech-card">
                  <div className="tech-logo-bg">
                    <img src={tech.logo} alt={tech.name} />
                  </div>
                  <div className="tech-card-title">{tech.name}</div>
                  <div className="tech-card-desc">{tech.description}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Course Benefits Section */}
      <div className="py-4 bg-white position-relative overflow-hidden">
        <div className="container position-relative">
          <div className="text-center mb-4">
            <div className="course-benefits-title">
              What You'll Get in This Course
        </div>
            <div className="course-benefits-desc">
              A comprehensive learning experience designed to help you succeed in your career
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {courseBenefits.map((benefit, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <div className="course-benefit-card-alt">
                  <div className="course-benefit-header">
                    <div className="course-benefit-icon-alt">
                    {benefit.icon}
                  </div>
                    <div className="course-benefit-highlight-alt">
                      {benefit.highlight}
                    </div>
                  </div>
                  <div className="course-benefit-content-alt">
                    <div className="course-benefit-title-alt">
                      {benefit.title}
                    </div>
                    <div className="course-benefit-desc-alt">
                      {benefit.description}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
                </div>
              </div>

      {/* Start Your Journey Section */}
      <div className="container mt-5">
        <Card className="journey-card">
          <div className="text-center mb-4">
            <Text className="journey-badge">Start Your Journey Today</Text>
            <Title level={3} className="text-white mb-3">
              Experience Our Training First-Hand
            </Title>
            <Paragraph
              className="text-white-50 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              Join our training program with a 7-day free trial. No
              commitment required, and you can leave anytime if you're not
              satisfied.
            </Paragraph>
            </div>

          <Row gutter={[24, 24]} className="mb-4">
            <Col xs={24} md={8}>
              <Card className="journey-feature-card">
                <CheckCircleOutlined className="journey-feature-icon" />
                <Title level={5} className="text-white mb-1">
                  7 Free Classes
                </Title>
                <Text className="text-white-50">
                  Start learning immediately
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="journey-feature-card">
                <ClockCircleOutlined className="journey-feature-icon" />
                <Title level={5} className="text-white mb-1">
                  No Commitment
                </Title>
                <Text className="text-white-50">
                  Leave anytime if not satisfied
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="journey-feature-card">
                <DollarOutlined className="journey-feature-icon" />
                <Title level={5} className="text-white mb-1">
                  Money-Back Guarantee
                </Title>
                <Text className="text-white-50">
                  100% satisfaction guaranteed
                </Text>
              </Card>
            </Col>
          </Row>

          <div className="text-center">
            <Button
              type="primary"
              size="large"
              onClick={() => handleCTANavigate("/student/batches")}
              className="bg-white text-primary border-0 px-5 py-3 fw-semibold shadow-lg hover-shadow-xl"
            >
              <Space>
                <span>Enroll for a New Batch</span>
                <ArrowRightOutlined />
              </Space>
            </Button>
          </div>
        </Card>
      </div>

      {/* Testimonials Section */}
      <div className="py-5 bg-gradient-light">
        <div className="container">
          <div className="text-center mb-4">
            <div className="testimonial-title-new">
              What Our Students Say
            </div>
            <div className="testimonial-desc-new">
              Hear from our students about their learning journey and career growth
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <div className="testimonial-card-new">
                  <div className="testimonial-quote">"</div>
                  <div className="testimonial-content">
                    <div className="testimonial-text">
                      {testimonial.content}
                    </div>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                    {testimonial.avatar}
                  </div>
                      <div className="testimonial-info">
                        <div className="testimonial-name">
                          {testimonial.name}
                        </div>
                        <div className="testimonial-role">
                          {testimonial.role}
                        </div>
                  </div>
                </div>
                    <div className="testimonial-rating">
                      <Rate disabled defaultValue={5} />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-5 bg-white">
        <div className="container">
          <Row gutter={[48, 48]} className="align-items-center">
              {/* Left Content */}
            <Col lg={12}>
              <div className="position-relative">
                <div className="cta-title-new">
                      Ready to Transform Your Career?
                </div>
                <div className="cta-desc-new">
                      Take the first step towards becoming a professional developer. Join our next batch and start your journey today.
                </div>

                <div className="cta-features">
                  <div className="cta-feature-item">
                    <div className="cta-feature-icon">
                      <CheckCircleOutlined />
                        </div>
                    <div className="cta-feature-content">
                      <div className="cta-feature-title">Next Batch Starting Soon</div>
                      <div className="cta-feature-desc">Limited seats available</div>
                        </div>
                      </div>
                  <div className="cta-feature-item">
                    <div className="cta-feature-icon">
                      <CheckCircleOutlined />
                        </div>
                    <div className="cta-feature-content">
                      <div className="cta-feature-title">7-Day Free Trial</div>
                      <div className="cta-feature-desc">Experience our training first-hand</div>
                        </div>
                      </div>
                  <div className="cta-feature-item">
                    <div className="cta-feature-icon">
                      <CheckCircleOutlined />
                    </div>
                    <div className="cta-feature-content">
                      <div className="cta-feature-title">Personalized Learning</div>
                      <div className="cta-feature-desc">Get individual attention and guidance</div>
                    </div>
                  </div>
                </div>

                <div className="cta-buttons">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => handleCTANavigate("/signup")}
                    className="cta-button-primary"
                  >
                    <Space>
                      <span>Start Your Journey</span>
                      <ArrowRightOutlined />
                    </Space>
                  </Button>
                  <Button
                    size="large"
                    onClick={() => handleCTANavigate("/schedule")}
                    className="cta-button-secondary"
                  >
                    <Space>
                      <span>View Schedule</span>
                      <CalendarOutlined />
                    </Space>
                  </Button>
                </div>
              </div>
            </Col>

              {/* Right Content - Batch Info Card */}
            <Col lg={12}>
              <div className="cta-card-new">
                <div className="cta-card-header">
                  <div className="cta-card-badge">Next Batch Details</div>
                  <div className="cta-card-title">Full Stack Development</div>
                  <div className="cta-card-subtitle">Starting in 7 days</div>
                </div>

                <div className="cta-card-features">
                  <div className="cta-card-feature">
                    <div className="cta-card-feature-icon">
                      <ClockCircleOutlined />
                    </div>
                    <div className="cta-card-feature-content">
                      <div className="cta-card-feature-label">Duration</div>
                      <div className="cta-card-feature-value">6 Months</div>
                    </div>
                      </div>
                  <div className="cta-card-feature">
                    <div className="cta-card-feature-icon">
                      <TeamOutlined />
                    </div>
                    <div className="cta-card-feature-content">
                      <div className="cta-card-feature-label">Batch Size</div>
                      <div className="cta-card-feature-value">15 Students</div>
                    </div>
                  </div>
                  <div className="cta-card-feature">
                    <div className="cta-card-feature-icon">
                      <BookOutlined />
                    </div>
                    <div className="cta-card-feature-content">
                      <div className="cta-card-feature-label">Curriculum</div>
                      <div className="cta-card-feature-value">Industry-Ready Skills</div>
                    </div>
                  </div>
                </div>

                <div className="cta-card-footer">
                  <div className="cta-card-timer">
                    <ClockCircleOutlined />
                    <span>Limited seats available</span>
              </div>
            </div>
          </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-new">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-brand">
                <div className="footer-logo">
                  Train With <span className="blue">Jayanth</span>
                </div>
                <div className="footer-desc">
                Dedicated to helping students master technology skills and build successful careers through personalized training and mentorship.
                </div>
                <div className="footer-social">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>

              <div className="footer-links">
                <div className="footer-links-column">
                  <div className="footer-links-title">Quick Links</div>
                  <Link to="/" className="footer-link">Home</Link>
                  <Link to="/courses" className="footer-link">Courses</Link>
                  <Link to="/schedule" className="footer-link">Schedule</Link>
                  <Link to="/about" className="footer-link">About</Link>
                </div>

                <div className="footer-links-column">
                  <div className="footer-links-title">Resources</div>
                  <Link to="/blog" className="footer-link">Blog</Link>
                  <Link to="/faq" className="footer-link">FAQ</Link>
                  <Link to="/success-stories" className="footer-link">Success Stories</Link>
                  <Link to="/contact" className="footer-link">Contact</Link>
                </div>

                <div className="footer-links-column">
                  <div className="footer-links-title">Legal</div>
                  <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                  <Link to="/terms" className="footer-link">Terms of Service</Link>
                  <Link to="/refund" className="footer-link">Refund Policy</Link>
                </div>
              </div>

              <div className="footer-contact">
                <div className="footer-links-title">Contact Us</div>
                <div className="footer-contact-item">
                  <MailOutlined />
                  <span>jayanth@trainwithjayanth.com</span>
                </div>
                <div className="footer-contact-item">
                  <PhoneOutlined />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="footer-contact-item">
                  <EnvironmentOutlined />
                  <span>Bangalore, India</span>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-copyright">
                &copy; {new Date().getFullYear()} Train With Jayanth. All rights reserved.
              </div>
              <div className="footer-bottom-links">
                <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
                <Link to="/terms" className="footer-bottom-link">Terms</Link>
                <Link to="/cookies" className="footer-bottom-link">Cookies</Link>
            </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
