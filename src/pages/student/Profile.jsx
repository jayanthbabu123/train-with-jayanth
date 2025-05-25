import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Space, 
  Tag, 
  Spin, 
  Typography,
  Row,
  Col,
  Divider,
  Upload,
  message
} from 'antd';
import { 
  EditOutlined, 
  SaveOutlined, 
  CloseOutlined, 
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BookOutlined,
  TrophyOutlined,
  CameraOutlined,
  IdcardOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const BRAND_COLOR = '#0067b8';

// Gradient backgrounds for sections
const GRADIENTS = {
  primary: 'linear-gradient(135deg, #0067b8 0%, #00a4ef 100%)',
  success: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
  warning: 'linear-gradient(135deg, #faad14 0%, #ffd666 100%)',
  purple: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)'
};

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    education: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = {
            ...docSnap.data(),
            skills: Array.isArray(docSnap.data().skills) ? docSnap.data().skills : [],
          };
          setProfile(data);
          form.setFieldsValue(data);
        }
      } catch (error) {
        toast.error('Failed to fetch profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser.uid, form]);

  const handleUpdateProfile = async (values) => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, values);
      setProfile(values);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      const updatedSkills = [...profile.skills, newSkill.trim()];
      setProfile({ ...profile, skills: updatedSkills });
      form.setFieldValue('skills', updatedSkills);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = profile.skills.filter(skill => skill !== skillToRemove);
    setProfile({ ...profile, skills: updatedSkills });
    form.setFieldValue('skills', updatedSkills);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px 0',
      maxWidth: '100vw',
      minHeight: '100vh',
      background: '#f7fafd',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      transition: 'max-width 0.3s',
    }}>
      <div style={{ 
        background: GRADIENTS.primary,
        borderRadius: 20,
        padding: '24px 24px 16px 24px',
        margin: '0 auto 20px auto',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        transition: 'max-width 0.3s',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
          <UserOutlined style={{ fontSize: 200 }} />
        </div>
        <Row gutter={[24, 24]} align="middle" style={{ width: '100%' }}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={160}
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'User'}
              style={{ 
                border: '4px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                fontSize: '64px'
              }}
            >
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            {editing && (
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={({ file }) => {
                  if (file) {
                    message.info('Photo upload functionality will be implemented soon!');
                  }
                }}
              >
                <Button 
                  type="primary" 
                  icon={<CameraOutlined />}
                  style={{ 
                    marginTop: 16,
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Change Photo
                </Button>
              </Upload>
            )}
          </Col>
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>
              {currentUser.displayName || 'Your Profile'}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, display: 'block', marginTop: 8 }}>
              {profile.bio || 'Add a bio to tell others about yourself'}
            </Text>
            <div style={{ marginTop: 24 }}>
              <Space size={16} wrap>
                {profile.skills.map((skill, index) => (
                  <Tag
                    key={index}
                    style={{ 
                      padding: '4px 12px',
                      fontSize: 14,
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: 'white'
                    }}
                  >
                    {skill}
                  </Tag>
                ))}
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      <Card
        bordered={false}
        style={{ 
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          background: 'white',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 24,
          padding: '0 8px'
        }}>
          <Title level={3} style={{ margin: 0, color: '#222' }}>Profile Information</Title>
          <Button
            type={editing ? "default" : "primary"}
            icon={editing ? <CloseOutlined /> : <EditOutlined />}
            onClick={() => setEditing(!editing)}
            size="large"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={profile}
          disabled={!editing}
        >
          <Row gutter={[24, 24]} style={{ width: '100%' }}>
            <Col xs={24} md={12} style={{ minWidth: 0 }}>
              <Card 
                bordered={false}
                style={{ 
                  background: '#f8f9fa',
                  borderRadius: 16
                }}
              >
                <Title level={4} style={{ marginBottom: 24 }}>
                  <MailOutlined style={{ marginRight: 8, color: BRAND_COLOR }} />
                  Contact Information
                </Title>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input prefix={<UserOutlined />} size="large" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email Address"
                >
                  <Input prefix={<MailOutlined />} size="large" disabled />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                >
                  <Input prefix={<PhoneOutlined />} size="large" />
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} md={12} style={{ minWidth: 0 }}>
              <Card 
                bordered={false}
                style={{ 
                  background: '#f8f9fa',
                  borderRadius: 16
                }}
              >
                <Title level={4} style={{ marginBottom: 24 }}>
                  <TrophyOutlined style={{ marginRight: 8, color: BRAND_COLOR }} />
                  Skills & Expertise
                </Title>
                <Form.Item
                  name="skills"
                  label="Your Skills"
                >
                  <div>
                    <Space wrap style={{ marginBottom: 16 }}>
                      {profile.skills.map((skill, index) => (
                        <Tag
                          key={index}
                          closable={editing}
                          onClose={() => handleRemoveSkill(skill)}
                          style={{ 
                            padding: '4px 12px',
                            fontSize: 14,
                            background: 'white',
                            borderRadius: 6
                          }}
                        >
                          {skill}
                        </Tag>
                      ))}
                    </Space>
                    {editing && (
                      <Space.Compact style={{ width: '100%' }}>
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                          onPressEnter={handleAddSkill}
                          size="large"
                        />
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={handleAddSkill}
                          size="large"
                        >
                          Add
                        </Button>
                      </Space.Compact>
                    )}
                  </div>
                </Form.Item>
              </Card>
            </Col>

            <Col span={24} style={{ minWidth: 0 }}>
              <Card 
                bordered={false}
                style={{ 
                  background: '#f8f9fa',
                  borderRadius: 16
                }}
              >
                <Title level={4} style={{ marginBottom: 24 }}>
                  <BookOutlined style={{ marginRight: 8, color: BRAND_COLOR }} />
                  About Me
                </Title>
                <Form.Item
                  name="bio"
                  label="Bio"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Tell us about yourself..."
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Card>
            </Col>

            <Col span={24} style={{ minWidth: 0 }}>
              <Card 
                bordered={false}
                style={{ 
                  background: '#f8f9fa',
                  borderRadius: 16
                }}
              >
                <Title level={4} style={{ marginBottom: 24 }}>
                  <IdcardOutlined style={{ marginRight: 8, color: BRAND_COLOR }} />
                  Education & Experience
                </Title>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="education"
                      label="Education"
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="Your educational background..."
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="experience"
                      label="Experience"
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="Your work experience..."
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {editing && (
              <Col span={24} style={{ textAlign: 'right', minWidth: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  style={{ 
                    padding: '0 32px',
                    height: 48,
                    fontSize: 16
                  }}
                >
                  Save Changes
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </Card>
    </div>
  );
} 