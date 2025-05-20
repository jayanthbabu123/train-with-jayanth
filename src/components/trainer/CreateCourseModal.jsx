import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Modal, Form, Input, Select, Button, Space, Tag, Typography, Row, Col } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const CreateCourseModal = ({ isOpen, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const [newTechnology, setNewTechnology] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newOutcome, setNewOutcome] = useState('');

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'courses'), {
        ...values,
        technologies,
        prerequisites,
        learningOutcomes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      onSuccess();
      onClose();
      form.resetFields();
      setTechnologies([]);
      setPrerequisites([]);
      setLearningOutcomes([]);
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setTechnologies([...technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setPrerequisites([...prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite('');
    }
  };

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const removeTechnology = (tech) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const removePrerequisite = (prereq) => {
    setPrerequisites(prerequisites.filter(p => p !== prereq));
  };

  const removeOutcome = (outcome) => {
    setLearningOutcomes(learningOutcomes.filter(o => o !== outcome));
  };

  return (
    <Modal
      title={<Title level={4} className="mb-0">Create New Course</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="title"
          label="Course Title"
          rules={[{ required: true, message: 'Please enter course title' }]}
        >
          <Input placeholder="Enter course title" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter course description' }]}
        >
          <TextArea rows={4} placeholder="Enter course description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: 'Please enter course duration' }]}
            >
              <Input placeholder="e.g., 3 months" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="level"
              label="Level"
              initialValue="Beginner"
              rules={[{ required: true, message: 'Please select course level' }]}
            >
              <Select size="large">
                <Select.Option value="Beginner">Beginner</Select.Option>
                <Select.Option value="Intermediate">Intermediate</Select.Option>
                <Select.Option value="Advanced">Advanced</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Technologies">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              placeholder="Add technology"
              size="large"
            />
            <Button 
              type="primary" 
              onClick={addTechnology}
              icon={<PlusOutlined />}
              size="large"
            >
              Add
            </Button>
          </Space.Compact>
          <div className="mt-2">
            {technologies.map((tech, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removeTechnology(tech)}
                color="blue"
                className="mb-2"
              >
                {tech}
              </Tag>
            ))}
          </div>
        </Form.Item>

        <Form.Item label="Prerequisites">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={newPrerequisite}
              onChange={(e) => setNewPrerequisite(e.target.value)}
              placeholder="Add prerequisite"
              size="large"
            />
            <Button 
              type="primary" 
              onClick={addPrerequisite}
              icon={<PlusOutlined />}
              size="large"
            >
              Add
            </Button>
          </Space.Compact>
          <div className="mt-2">
            {prerequisites.map((prereq, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removePrerequisite(prereq)}
                color="green"
                className="mb-2"
              >
                {prereq}
              </Tag>
            ))}
          </div>
        </Form.Item>

        <Form.Item label="Learning Outcomes">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              placeholder="Add learning outcome"
              size="large"
            />
            <Button 
              type="primary" 
              onClick={addOutcome}
              icon={<PlusOutlined />}
              size="large"
            >
              Add
            </Button>
          </Space.Compact>
          <div className="mt-2">
            {learningOutcomes.map((outcome, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removeOutcome(outcome)}
                color="purple"
                className="mb-2"
              >
                {outcome}
              </Tag>
            ))}
          </div>
        </Form.Item>

        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            size="large"
          >
            Create Course
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateCourseModal; 