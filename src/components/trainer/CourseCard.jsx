import React from 'react';
import { EditOutlined, TeamOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons';
import { Card, Typography, Tag, Button, Space } from 'antd';

const { Title, Paragraph } = Typography;

const CourseCard = ({ course, onEdit }) => {
  return (
    <Card
      hoverable
      className="h-100"
      cover={
        <div 
          className="position-relative" 
          style={{ 
            height: '120px',
            background: 'linear-gradient(to right, #1890ff, #722ed1)'
          }}
        >
          <div 
            className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0, 0, 0, 0.1)' }}
          >
            <Title level={4} className="text-white text-center mb-0 px-3" style={{ fontSize: '1.25rem' }}>
              {course.title}
            </Title>
          </div>
        </div>
      }
    >
      <Space direction="vertical" size="small" className="w-100">
        <Space size="small">
          <Tag color="blue">{course.level}</Tag>
          <Tag color="green">{course.duration}</Tag>
        </Space>

        <Paragraph className="text-muted mb-2" ellipsis={{ rows: 2 }}>
          {course.description}
        </Paragraph>

        <div className="d-flex justify-content-between text-muted mb-2">
          <Space>
            <TeamOutlined />
            <span>{course.batches?.length || 0} Batches</span>
          </Space>
          <Space>
            <BookOutlined />
            <span>{course.technologies?.length || 0} Tech</span>
          </Space>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={onEdit}
            className="p-0"
          >
            Manage
          </Button>
          <small className="text-muted">
            {new Date(course.createdAt?.toDate()).toLocaleDateString()}
          </small>
        </div>
      </Space>
    </Card>
  );
};

export default CourseCard; 