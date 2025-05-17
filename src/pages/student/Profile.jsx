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
  Divider
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card
        bordered={false}
        style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>Profile Settings</Title>
          <Button
            type={editing ? "default" : "primary"}
            icon={editing ? <CloseOutlined /> : <EditOutlined />}
            onClick={() => setEditing(!editing)}
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
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={120}
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  style={{ 
                    marginBottom: '16px',
                    backgroundColor: '#0067b8',
                    fontSize: '48px'
                  }}
                >
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                {editing && (
                  <Button type="link" icon={<EditOutlined />}>
                    Change Photo
                  </Button>
                )}
              </div>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="Phone"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="bio"
                label="Bio"
              >
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item
                name="skills"
                label="Skills"
              >
                <div>
                  <Space wrap style={{ marginBottom: '8px' }}>
                    {profile.skills.map((skill, index) => (
                      <Tag
                        key={index}
                        closable={editing}
                        onClose={() => handleRemoveSkill(skill)}
                        style={{ padding: '4px 8px', fontSize: '14px' }}
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
                      />
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddSkill}
                      >
                        Add
                      </Button>
                    </Space.Compact>
                  )}
                </div>
              </Form.Item>

              <Divider />

              <Form.Item
                name="education"
                label="Education"
              >
                <TextArea rows={2} />
              </Form.Item>

              <Form.Item
                name="experience"
                label="Experience"
              >
                <TextArea rows={2} />
              </Form.Item>

              {editing && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Save Changes
                  </Button>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
} 