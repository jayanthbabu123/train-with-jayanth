import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { Card, Button, Tag, Table, Modal, Spin, Space } from 'antd';
import { TeamOutlined, CheckCircleTwoTone, ClockCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

const BRAND_COLOR = '#0067b8';

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
];

export default function TrainerBatches() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const q = query(collection(db, 'batch_registrations'));
      const querySnapshot = await getDocs(q);
      const registrationList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistrations(registrationList);
    } catch (error) {
      toast.error('Failed to fetch registrations');
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'batch_registrations', registrationId), {
        status: newStatus
      });
      toast.success('Status updated successfully');
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const getRegistrationsForBatch = (batchId) => {
    return registrations.filter(reg => reg.batchId === batchId);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="gold" icon={<ClockCircleTwoTone twoToneColor="#faad14" />}>Pending</Tag>;
      case 'approved':
        return <Tag color="green" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>Approved</Tag>;
      case 'rejected':
        return <Tag color="red" icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}>Rejected</Tag>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 style={{ color: 'var(--ant-primary-color)', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>
        Batch Management
      </h1>
      <div className="row g-4">
        {batches.map((batch) => {
          const batchRegistrations = getRegistrationsForBatch(batch.id);
          const pendingCount = batchRegistrations.filter(reg => reg.status === 'pending').length;
          return (
            <div className="col-12 col-md-6 col-lg-4" key={batch.id}>
              <Card
                bordered={false}
                style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}
                headStyle={{ background: '#f5f6fa', borderRadius: '12px 12px 0 0' }}
                title={
                  <Space>
                    <span style={{ fontSize: 24 }}>{batch.icon}</span>
                    <span style={{ fontWeight: 600 }}>{batch.name}</span>
                  </Space>
                }
                extra={<Tag color="blue">Start: {batch.start}</Tag>}
              >
                <div style={{ color: '#888', marginBottom: 8 }}>{batch.description}</div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ color: '#555' }}>Total Registrations:</span>
                  <span style={{ fontWeight: 600 }}>{batchRegistrations.length}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ color: '#555' }}>Pending Reviews:</span>
                  <span style={{ fontWeight: 600, color: '#faad14' }}>{pendingCount}</span>
                </div>
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 16, fontWeight: 600 }}
                  onClick={() => {
                    setSelectedBatch(batch);
                    setModalOpen(true);
                  }}
                >
                  View Registrations
                </Button>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Registration Details Modal */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
        title={
          <span style={{ fontWeight: 700, fontSize: 22 }}>
            {selectedBatch?.name} - Registrations
          </span>
        }
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        destroyOnClose
      >
        <Table
          dataSource={selectedBatch ? getRegistrationsForBatch(selectedBatch.id) : []}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
            },
            {
              title: 'Mobile',
              dataIndex: 'mobile',
              key: 'mobile',
            },
            {
              title: 'Registered On',
              dataIndex: 'registeredAt',
              key: 'registeredAt',
              render: (date) => date?.toDate ? date.toDate().toLocaleDateString() : 'N/A',
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => getStatusTag(status),
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, registration) => registration.status === 'pending' && (
                <Space>
                  <Button
                    type="link"
                    style={{ color: 'green', padding: 0 }}
                    onClick={() => handleStatusUpdate(registration.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    type="link"
                    style={{ color: 'red', padding: 0 }}
                    onClick={() => handleStatusUpdate(registration.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
} 