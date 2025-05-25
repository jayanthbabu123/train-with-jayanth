import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Spin, Divider, Row, Col } from 'antd';
import { GoogleOutlined, LockOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'student') {
        navigate('/student/dashboard');
      } else if (currentUser.role === 'trainer') {
        navigate('/trainer/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative" style={{ 
      background: 'linear-gradient(135deg, #0067b8 0%, #f8f9fa 100%)',
      overflow: 'hidden'
    }}>
      {/* Background waves */}
      <div className="position-absolute bottom-0 w-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path 
            fill="#ffffff" 
            fillOpacity="0.1" 
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
      
      <div className="container">
        <Row justify="center">
          <Col xs={22} sm={18} md={12} lg={8}>
            <Card 
              bordered={false} 
              className="shadow-lg" 
              style={{ 
                borderRadius: '16px', 
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <div 
                    style={{
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(135deg, #0067b8 0%, #1e3a8a 100%)',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#fff',
                      fontSize: 30,
                      boxShadow: '0 4px 12px rgba(0, 103, 184, 0.2)'
                    }}
                  >
                    TJ
                  </div>
                </div>
                <Title level={2} style={{ marginBottom: 8, color: '#0067b8' }}>
                  Welcome Back
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Sign in to continue your learning journey
                </Text>
              </div>
              
              <Button
                block
                size="large"
                onClick={handleGoogleSignIn}
                disabled={loading}
                icon={<GoogleOutlined />}
                style={{ 
                  height: 48, 
                  borderRadius: 8, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? <Spin size="small" /> : 'Continue with Google'}
              </Button>
              
              <Divider plain style={{ margin: '24px 0' }}>
                <Text type="secondary">Secure Authentication</Text>
              </Divider>
              
              <div className="d-flex justify-content-around text-center">
                <div>
                  <LockOutlined style={{ fontSize: 20, color: '#0067b8' }} />
                  <div className="mt-2">
                    <Text type="secondary" style={{ fontSize: 13 }}>Secure Login</Text>
                  </div>
                </div>
                <div>
                  <ClockCircleOutlined style={{ fontSize: 20, color: '#0067b8' }} />
                  <div className="mt-2">
                    <Text type="secondary" style={{ fontSize: 13 }}>24/7 Support</Text>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  By signing in, you agree to our{' '}
                  <Link to="/terms" style={{ color: '#0067b8' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ color: '#0067b8' }}>
                    Privacy Policy
                  </Link>
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
} 