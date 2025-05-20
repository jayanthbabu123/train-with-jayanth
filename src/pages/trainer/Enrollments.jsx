import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Table, Card, Typography, Tag, Button, Space, Modal, Select, Spin, Row, Col, Empty } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

export default function TrainerEnrollments() {
  const { currentUser } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveModal, setApproveModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentUser?.uid]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all enrollments (no trainerId filter)
      const enrollQ = query(collection(db, 'enrollments'));
      const enrollSnap = await getDocs(enrollQ);
      const enrollList = enrollSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEnrollments(enrollList);
      // Fetch all batches for this trainer's courses
      const coursesQ = query(collection(db, 'courses'), where('createdBy', '==', currentUser.uid));
      const coursesSnap = await getDocs(coursesQ);
      const courseIds = coursesSnap.docs.map(doc => doc.id);
      const batchesQ = query(collection(db, 'batches'));
      const batchesSnap = await getDocs(batchesQ);
      console.log(batchesSnap.docs)
      const batchList = batchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(batchList)
      setBatches(batchList);
    } catch (e) {
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setSelectedBatch(enrollment.assignedBatchId || null);
    setApproveModal(true);
  };

  const handleApprove = async () => {
    if (!selectedBatch) {
      toast.error('Please select a batch');
      return;
    }
    setApproving(true);
    try {
      // Update enrollment
      await updateDoc(doc(db, 'enrollments', selectedEnrollment.id), {
        status: 'active',
        assignedBatchId: selectedBatch
      });
      // Get batch name and batchId for user update
      const batchDoc = await getDoc(doc(db, 'batches', selectedBatch));
      const batchData = batchDoc.data();
      await updateDoc(doc(db, 'users', selectedEnrollment.studentId), {
        batchId: batchData?.batchId || selectedBatch,
        batchName: batchData?.name || ''
      });
      toast.success('Enrollment approved and batch assigned!');
      setApproveModal(false);
      setSelectedEnrollment(null);
      setSelectedBatch(null);
      fetchData();
    } catch (e) {
      toast.error('Failed to approve enrollment');
    } finally {
      setApproving(false);
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong><UserOutlined /> {text}</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>{record.studentEmail}</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>{record.studentPhone}</Text>
        </Space>
      )
    },
    {
      title: 'Course',
      dataIndex: 'courseTitle',
      key: 'courseTitle',
      render: (text) => <Text><BookOutlined /> {text}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status === 'pending' ? <Tag color="orange">Pending</Tag> :
        status === 'active' ? <Tag color="green">Active</Tag> :
        <Tag color="red">{status}</Tag>
      )
    },
    {
      title: 'Batch',
      dataIndex: 'assignedBatchId',
      key: 'assignedBatchId',
      render: (batchId, record) => {
        if (!batchId) return <Text type="secondary">Not assigned</Text>;
        const batch = batches.find(b => b.id === batchId);
        return batch ? <Tag color="blue">{batch.name}</Tag> : <Tag color="red">Unknown</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.status === 'pending' ? (
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => openApproveModal(record)}>
            Approve & Assign Batch
          </Button>
        ) : <Text type="secondary">-</Text>
      )
    }
  ];

  return (
    <div className="container py-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={2} style={{ margin: 0 }}>Enrollment Requests</Title>
          <Text type="secondary">Review, approve, and assign students to batches</Text>
        </Col>
      </Row>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2' }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
            <Spin size="large" />
          </div>
        ) : enrollments.length === 0 ? (
          <Empty description="No enrollment requests yet" />
        ) : (
          <Table
            columns={columns}
            dataSource={enrollments}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            bordered
            size="middle"
          />
        )}
      </Card>
      <Modal
        title={<Title level={4} className="mb-0">Approve Enrollment & Assign Batch</Title>}
        open={approveModal}
        onCancel={() => setApproveModal(false)}
        footer={null}
        destroyOnClose
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Student:</Text> <Text>{selectedEnrollment?.studentName}</Text><br />
            <Text strong>Email:</Text> <Text>{selectedEnrollment?.studentEmail}</Text><br />
            <Text strong>Phone:</Text> <Text>{selectedEnrollment?.studentPhone}</Text><br />
            <Text strong>Course:</Text> <Text>{selectedEnrollment?.courseTitle}</Text>
          </div>
          <div>
            <Text strong>Assign to Batch:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Select a batch"
              value={selectedBatch}
              onChange={setSelectedBatch}
              size="large"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
            >
              {batches
                .filter(b => b.courseId === selectedEnrollment?.courseId)
                .map(b => (
                  <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                ))}
            </Select>
          </div>
          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <Button onClick={() => setApproveModal(false)} size="large">Cancel</Button>
            <Button type="primary" icon={<CheckCircleOutlined />} loading={approving} onClick={handleApprove} size="large">
              Approve & Assign
            </Button>
          </div>
        </Space>
      </Modal>
    </div>
  );
} 