import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Modal, Form, Input, Select, Button, Space, Tag, Typography, Row, Col, DatePicker, TimePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const CreateBatchModal = ({ isOpen, onClose, courses, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [newTechnology, setNewTechnology] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(null);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Auto-suggest batch name
  useEffect(() => {
    if (!selectedCourseId || !selectedStartDate) return;
    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) return;
    const dateStr = selectedStartDate.format('YYYY_MM_DD');
    const suggestedName = `${course.title.replace(/\s+/g, '')}_${dateStr}`;
    form.setFieldsValue({ name: suggestedName });
  }, [selectedCourseId, selectedStartDate]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const batchData = {
        ...values,
        technologies,
        schedule: {
          days: selectedDays,
          startTime: values.schedule.startTime.format('HH:mm'),
          endTime: values.schedule.endTime.format('HH:mm')
        },
        startDate: values.schedule.startDate.format('YYYY-MM-DD'),
        endDate: values.schedule.endDate.format('YYYY-MM-DD'),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'upcoming'
      };

      // Create the batch document
      const batchRef = await addDoc(collection(db, 'batches'), batchData);

      // Update the course document to include the batch reference
      const courseRef = doc(db, 'courses', values.courseId);
      await updateDoc(courseRef, {
        batches: arrayUnion(batchRef.id),
        updatedAt: serverTimestamp()
      });

      onSuccess();
      onClose();
      form.resetFields();
      setTechnologies([]);
      setSelectedDays([]);
    } catch (error) {
      console.error('Error creating batch:', error);
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

  const removeTechnology = (tech) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <Modal
      title={<Title level={4} className="mb-0">Create New Batch</Title>}
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
          name="name"
          label="Batch Name"
          rules={[{ required: true, message: 'Please enter batch name' }]}
        >
          <Input placeholder="Enter batch name" size="large" />
        </Form.Item>

        <Form.Item
          name="courseId"
          label="Select Course"
          rules={[{ required: true, message: 'Please select a course' }]}
        >
          <Select 
            placeholder="Select a course" 
            size="large"
            onChange={val => setSelectedCourseId(val)}
          >
            {courses.map((course) => (
              <Option key={course.id} value={course.id}>
                {course.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['schedule', 'startDate']}
              label="Start Date"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                size="large"
                format="YYYY-MM-DD"
                onChange={date => setSelectedStartDate(date)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['schedule', 'endDate']}
              label="End Date"
              rules={[{ required: true, message: 'Please select end date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                size="large"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Schedule">
          <div className="d-flex flex-wrap gap-2 mb-3">
            {daysOfWeek.map((day) => (
              <Button
                key={day}
                type={selectedDays.includes(day) ? 'primary' : 'default'}
                onClick={() => toggleDay(day)}
                size="large"
              >
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['schedule', 'startTime']}
                label="Start Time"
                rules={[{ required: true, message: 'Please select start time' }]}
              >
                <TimePicker 
                  style={{ width: '100%' }} 
                  size="large"
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['schedule', 'endTime']}
                label="End Time"
                rules={[{ required: true, message: 'Please select end time' }]}
              >
                <TimePicker 
                  style={{ width: '100%' }} 
                  size="large"
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          name="maxStudents"
          label="Maximum Students"
          initialValue={20}
          rules={[{ required: true, message: 'Please enter maximum students' }]}
        >
          <Input type="number" min={1} size="large" />
        </Form.Item>

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
            Create Batch
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateBatchModal; 