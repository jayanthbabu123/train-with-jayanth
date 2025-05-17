import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import { Table, Card, Button, Tag, Avatar, Spin, Space } from 'antd';
import { FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const BRAND_COLOR = '#0067b8';

export default function TrainerMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const q = query(collection(db, 'materials'));
        const querySnapshot = await getDocs(q);
        const materialList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMaterials(materialList);
      } catch (error) {
        toast.error('Failed to fetch materials');
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, material) => (
        <Space>
          <Avatar style={{ background: BRAND_COLOR }} icon={<FileTextOutlined />} />
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ color: '#888', fontSize: 13 }}>{material.description}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color="blue" style={{ fontWeight: 500 }}>{type}</Tag>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'gold'} style={{ fontWeight: 500 }}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, material) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined style={{ color: BRAND_COLOR }} />}
            style={{ color: BRAND_COLOR, padding: 0 }}
            onClick={() => {/* TODO: Edit material */}}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            style={{ color: 'red', padding: 0 }}
            onClick={() => {/* TODO: Delete material */}}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: 'var(--ant-primary-color)', fontWeight: 700, fontSize: 28 }}>
            Learning Materials
          </h1>
          <Button type="primary" style={{ fontWeight: 600 }}>
            Upload New Material
          </Button>
        </div>
        <Table
          dataSource={materials}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
} 