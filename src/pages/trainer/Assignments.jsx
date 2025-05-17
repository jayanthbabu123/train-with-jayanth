import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LANGUAGE_TEMPLATES } from '../../config/languageTemplates';
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Typography, 
  Popconfirm,
  message,
  Tabs,
  Row,
  Col,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CodeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Sandpack } from '@codesandbox/sandpack-react';
import ReactMarkdown from 'react-markdown';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const BRAND_COLOR = '#0067b8';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [currentCode, setCurrentCode] = useState(LANGUAGE_TEMPLATES.javascript.files);
  const [sandpackKey, setSandpackKey] = useState(Date.now());

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const q = query(collection(db, 'assignments'));
      const querySnapshot = await getDocs(q);
      const assignmentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignments(assignmentsList);
    } catch (error) {
      message.error('Failed to fetch assignments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (value) => {
    if (!LANGUAGE_TEMPLATES[value]) return;
    
    // Update the current code files based on selected language
    const newFiles = {...LANGUAGE_TEMPLATES[value].files};
    
    // Special handling for JavaScript to fix preview issues
    if (value === 'javascript' && newFiles['/index.js'] && !newFiles['/script.js']) {
      // Handle case when script.js might be missing but referenced in HTML
      const htmlContent = newFiles['/index.html'] || '';
      if (htmlContent.includes('script.js') && !newFiles['/script.js']) {
        newFiles['/script.js'] = newFiles['/index.js'];
        delete newFiles['/index.js'];
      }
    }
    
    // Update state and form fields
    setCurrentCode(newFiles);
    form.setFieldsValue({ 
      language: value,
      defaultCode: newFiles
    });
    
    // Force Sandpack to re-render with new key
    setSandpackKey(Date.now());
  };

  const handleCreate = () => {
    setEditingAssignment(null);
    const defaultLanguage = 'javascript';
    const defaultFiles = {...LANGUAGE_TEMPLATES[defaultLanguage].files};
    
    // Make sure we have the right structure for JavaScript files
    if (defaultFiles['/index.html'] && defaultFiles['/index.html'].includes('script.js') && !defaultFiles['/script.js']) {
      if (defaultFiles['/index.js']) {
        defaultFiles['/script.js'] = defaultFiles['/index.js'];
        delete defaultFiles['/index.js'];
      }
    }
    
    setCurrentCode(defaultFiles);
    setSandpackKey(Date.now());
    
    form.resetFields();
    form.setFieldsValue({
      language: defaultLanguage,
      defaultCode: defaultFiles
    });
    
    setModalVisible(true);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    
    // Ensure we have proper files structure
    let codeFiles = assignment.defaultCode;
    if (!codeFiles || typeof codeFiles !== 'object') {
      codeFiles = {...LANGUAGE_TEMPLATES[assignment.language].files};
    }
    
    setCurrentCode(codeFiles);
    setSandpackKey(Date.now());
    
    form.setFieldsValue({
      title: assignment.title,
      description: assignment.description,
      language: assignment.language,
      defaultCode: codeFiles,
      dueDate: assignment.dueDate
    });
    
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'assignments', id));
      message.success('Assignment deleted successfully');
      fetchAssignments();
    } catch (error) {
      message.error('Failed to delete assignment');
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Make sure to use the current code state which has the proper files
      const assignmentData = {
        ...values,
        defaultCode: currentCode, // Use the currentCode state instead of form value
        createdAt: new Date(),
        status: 'active'
      };

      if (editingAssignment) {
        await updateDoc(doc(db, 'assignments', editingAssignment.id), assignmentData);
        message.success('Assignment updated successfully');
      } else {
        await addDoc(collection(db, 'assignments'), assignmentData);
        message.success('Assignment created successfully');
      }

      setModalVisible(false);
      fetchAssignments();
    } catch (error) {
      message.error('Failed to save assignment');
      console.error('Error:', error);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <CodeOutlined style={{ color: LANGUAGE_TEMPLATES[record.language]?.color }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (language) => (
        <Tag 
          color={LANGUAGE_TEMPLATES[language]?.color} 
          style={{ 
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 500
          }}
        >
          {LANGUAGE_TEMPLATES[language]?.icon} {LANGUAGE_TEMPLATES[language]?.name}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (
        <Space>
          <ClockCircleOutlined />
          <span>{new Date(date).toLocaleDateString()}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'active' ? 'green' : 'default'}
          icon={status === 'active' ? <CheckCircleOutlined /> : null}
          style={{ 
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 500
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Assignment"
            description="Are you sure you want to delete this assignment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              style={{ 
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredAssignments = activeTab === 'all' 
    ? assignments 
    : assignments.filter(a => a.language === activeTab);

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        bordered={false} 
        style={{ 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          background: '#fff'
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, color: BRAND_COLOR }}>
            Assignment Management
          </Title>
          <Text type="secondary">
            Create and manage programming assignments
          </Text>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'all', label: 'All Assignments' },
              ...Object.entries(LANGUAGE_TEMPLATES).map(([key, lang]) => ({
                key,
                label: (
                  <Space>
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </Space>
                )
              }))
            ]}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Create Assignment
          </Button>
        </div>

        <Table
          dataSource={filteredAssignments}
          columns={columns}
          rowKey="id"
          pagination={{ 
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} assignments`
          }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={
          <Title level={4} style={{ margin: 0, color: BRAND_COLOR }}>
            {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
          </Title>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            language: 'javascript',
            defaultCode: LANGUAGE_TEMPLATES.javascript.files
          }}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter assignment title' }]}
              >
                <Input placeholder="Enter assignment title" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter assignment description' }]}
              >
                <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: '8px 12px', 
                    borderBottom: '1px solid #d9d9d9',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    Markdown Editor
                  </div>
                  <TextArea 
                    rows={6} 
                    placeholder="Write your description in markdown format..."
                    style={{ 
                      border: 'none',
                      borderRadius: 0,
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </Form.Item>
              <div style={{ 
                marginTop: '8px',
                padding: '16px',
                background: '#fafafa',
                borderRadius: '6px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ 
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  Preview
                </div>
                <div style={{ 
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  <ReactMarkdown>
                    {form.getFieldValue('description') || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Programming Language"
                rules={[{ required: true, message: 'Please select a language' }]}
              >
                <Select 
                  placeholder="Select language"
                  onChange={handleLanguageChange}
                >
                  {Object.entries(LANGUAGE_TEMPLATES).map(([key, lang]) => (
                    <Option key={key} value={key}>
                      <Space>
                        <span>{lang.icon}</span>
                        <span>{lang.name}</span>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: 'Please select due date' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="defaultCode"
                label="Default Code Snippet"
                rules={[{ required: true, message: 'Please enter default code' }]}
              >
                <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}>
                  <Sandpack
                    key={sandpackKey}
                    template={LANGUAGE_TEMPLATES[form.getFieldValue('language')]?.template || 'vanilla'}
                    files={currentCode}
                    options={{
                      showNavigator: true,
                      showTabs: true,
                      showLineNumbers: true,
                      showInlineErrors: true,
                      closableTabs: false,
                      wrapContent: true,
                      recompileMode: "delayed",
                      recompileDelay: 500
                    }}
                    theme="light"
                    customSetup={{
                      dependencies: form.getFieldValue('language') === 'react' ? 
                        {
                          "react": "^18.0.0",
                          "react-dom": "^18.0.0"
                        } : {}
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingAssignment ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}