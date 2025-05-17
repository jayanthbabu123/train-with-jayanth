import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { Card, Button, Modal, Input, Row, Col, Typography, Tag, Spin, Space } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const batches = [
  {
    id: 'mern',
    name: 'MERN Stack',
    icon: '🟩',
    start: '2024-06-20',
    description: 'Full-stack web development with MongoDB, Express, React, and Node.js.'
  },
  {
    id: 'react',
    name: 'React.js Batch',
    icon: '⚛️',
    start: '2024-06-25',
    description: 'Master React.js for building modern user interfaces.'
  },
  {
    id: 'html',
    name: 'HTML Batch',
    icon: '📄',
    start: '2024-07-01',
    description: 'Learn the fundamentals of HTML for web development.'
  },
  {
    id: 'css',
    name: 'CSS Batch',
    icon: '🎨',
    start: '2024-07-05',
    description: 'Style beautiful websites with modern CSS.'
  },
  // Add more batches as needed
];

export default function StudentBatches() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [form, setForm] = useState({ name: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchRegistrations();
    }
  }, [currentUser]);

  const fetchRegistrations = async () => {
    try {
      const q = query(
        collection(db, 'batch_registrations'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const registrationList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistrations(registrationList);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleJoin = (batch) => {
    if (!currentUser) {
      toast('Please login to register for a batch.');
      navigate('/login');
      return;
    }
    setSelectedBatch(batch);
    setForm({ name: currentUser.displayName || '', mobile: '' });
    setShowModal(true);
  };

  const handleRegister = async () => {
    if (!form.name.trim() || !form.mobile.trim()) {
      toast.error('Please provide your full name and mobile number.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'batch_registrations'), {
        userId: currentUser.uid,
        batchId: selectedBatch.id,
        batchName: selectedBatch.name,
        name: form.name,
        mobile: form.mobile,
        status: 'pending',
        registeredAt: serverTimestamp(),
      });
      toast.success('Registration submitted! The trainer will contact you shortly.');
      setShowModal(false);
      fetchRegistrations(); // Refresh registrations
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRegistrationStatus = (batchId) => {
    const registration = registrations.find(reg => reg.batchId === batchId);
    if (!registration) return null;
    return registration.status;
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
      approved: { color: 'success', icon: <CheckCircleOutlined />, text: 'Approved' },
      rejected: { color: 'error', icon: <CloseCircleOutlined />, text: 'Rejected' }
    };
    const config = statusConfig[status];
    return (
      <Tag color={config.color} icon={config.icon} style={{ borderRadius: 12, padding: '4px 8px' }}>
        {config.text}
      </Tag>
    );
  };

  return (
    <div className="container py-4">
      <Title level={2} className="text-center mb-4">Available Batches</Title>
      <Row gutter={[24, 24]}>
        {batches.map((batch) => {
          const status = getRegistrationStatus(batch.id);
          return (
            <Col xs={24} md={12} lg={8} key={batch.id}>
              <Card
                hoverable
                bordered={false}
                style={{
                  borderRadius: 12,
                  boxShadow: '0 2px 8px #f0f1f2',
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div className="text-center">
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{batch.icon}</div>
                  <Title level={4} style={{ marginBottom: 8 }}>{batch.name}</Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    {batch.description}
                  </Text>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text type="secondary">
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      Start Date: <Text strong>{batch.start}</Text>
                    </Text>
                    {status ? (
                      <div>
                        {getStatusTag(status)}
                        {status === 'pending' && (
                          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            Trainer will contact you shortly
                          </Text>
                        )}
                      </div>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => handleJoin(batch)}
                        style={{ width: '100%' }}
                      >
                        Join Batch
                      </Button>
                    )}
                  </Space>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Register for {selectedBatch?.name}
          </Title>
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={400}
        centered
      >
        <div className="mt-4">
          <Input
            placeholder="Enter your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ marginBottom: 16 }}
          />
          <Input
            placeholder="Enter your mobile number"
            value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value })}
            style={{ marginBottom: 24 }}
          />
          <Button
            type="primary"
            onClick={handleRegister}
            loading={loading}
            block
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </div>
      </Modal>
    </div>
  );
} 