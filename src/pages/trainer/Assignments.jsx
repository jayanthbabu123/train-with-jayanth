import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { LANGUAGE_TEMPLATES } from "../../config/languageTemplates";
import PageHeader from "../../components/common/PageHeader";
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
  message,
  Tabs,
  Row,
  Col,
  Tooltip,
  Breadcrumb,
  DatePicker,
  notification,
  Badge,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CodeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Sandpack,
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  useActiveCode,
} from "@codesandbox/sandpack-react";
import ReactMarkdown from "react-markdown";

const { Title, Text } = Typography;
const { TextArea } = Input;

const BRAND_COLOR = "#0067b8";

// Custom wrapper component to handle code changes from Sandpack editor
// This captures all code edits and updates the parent component state
function SandpackCodeEditorWrapper({
  setCurrentCode,
  currentCode,
  setActiveFile,
  form,
  codeChangeCount,
}) {
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;
  const { code, updateCode } = useActiveCode();

  // Make sure sandpack methods are available
  console.log("Sandpack API available:", sandpack);
  console.log("Available files:", Object.keys(currentCode));

  // Log to help debug
  console.log("SandpackCodeEditorWrapper render with activeFile:", activeFile);
  console.log("Current code state:", currentCode);

  // Update the active file when it changes
  useEffect(() => {
    if (!activeFile) return;

    console.log("Active file changed to:", activeFile);
    // We don't call setActiveFile here anymore to avoid infinite loop
    // Since we're already setting it from the parent component
  }, [activeFile]);

  // Handle code changes
  const handleCodeChange = useCallback(
    (newCode) => {
      if (!activeFile) {
        console.warn("No active file to update code for");
        return;
      }

      if (typeof newCode !== "string") {
        console.warn("Invalid code format received", newCode);
        return;
      }

      // Skip if the code hasn't actually changed
      if (currentCode[activeFile] === newCode) {
        return;
      }

      console.log("Change detected in file:", activeFile);
      console.log("Current codeChangeCount:", codeChangeCount.current);

      // Limit notifications to prevent overwhelming the user
      const shouldNotify = codeChangeCount.current % 5 === 0;

      // Track number of code changes for feedback
      codeChangeCount.current += 1;
      console.log("Incremented codeChangeCount to:", codeChangeCount.current);

      // Update the current code with the new code for the active file
      const updatedCode = { ...currentCode };
      updatedCode[activeFile] = newCode;
      console.log("Code changed for file:", activeFile);
      console.log("Updated code state:", updatedCode);
      setCurrentCode(updatedCode);

      // Notify user of code changes, but not too frequently
      if (shouldNotify) {
        if (activeFile.endsWith(".css")) {
          message.success({
            content: `CSS styles updated in ${activeFile}`,
            icon: <span style={{ marginRight: "5px" }}>🎨</span>,
            duration: 0.5,
          });
        } else {
          message.success(`Code updated for ${activeFile}`, 0.5);
        }
      }

      // Also update the form field value to ensure it's submitted
      if (form && form.setFieldsValue) {
        try {
          form.setFieldsValue({
            defaultCode: updatedCode,
          });
          console.log("Form field values updated with new code");
        } catch (error) {
          console.error("Error updating form value:", error);
        }
      }
    },
    [currentCode, activeFile, setCurrentCode, form, codeChangeCount],
  );

  // Set up an effect to listen for code changes
  useEffect(() => {
    if (code && activeFile) {
      console.log("Code changed in editor for file:", activeFile);
      console.log("Code content length:", code.length);
      handleCodeChange(code);
    }
  }, [code, handleCodeChange, activeFile]);

  // When active file changes, we just use it to render properly
  useEffect(() => {
    if (activeFile) {
      console.log("Active file in SandpackWrapper:", activeFile);
    }
  }, [activeFile]);

  return (
    <SandpackCodeEditor
      showLineNumbers={true}
      showTabs={true} // Show built-in tabs
      showInlineErrors={true}
      wrapContent={true}
      closableTabs={false}
      style={{ height: "600px", fontSize: "14px" }}
      tabButtonStyles={{
        css: { background: "#f6e8ff", fontWeight: "bold", color: "#722ed1" },
      }}
    />
  );
}

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("all");
  const [currentCode, setCurrentCode] = useState(
    LANGUAGE_TEMPLATES.javascript.files,
  );
  const [sandpackKey, setSandpackKey] = useState(Date.now());
  const [activeFile, setActiveFile] = useState(null);
  const codeChangeCount = useRef(0);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const q = query(collection(db, "assignments"));
      const querySnapshot = await getDocs(q);
      const assignmentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(assignmentsList);
      setAssignments(assignmentsList);
    } catch (error) {
      message.error("Failed to fetch assignments");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (value) => {
    if (!value || !LANGUAGE_TEMPLATES[value]) {
      console.warn("Invalid language selected:", value);
      return;
    }

    console.log("Language changed to:", value);

    // Set the active file to the CSS file if available, otherwise first file
    const newTemplateFiles = LANGUAGE_TEMPLATES[value].files;
    if (newTemplateFiles && Object.keys(newTemplateFiles).length > 0) {
      // Look for CSS file first
      const cssFile = Object.keys(newTemplateFiles).find((file) =>
        file.endsWith(".css"),
      );
      if (cssFile) {
        setActiveFile(cssFile);
        // Show notification to highlight CSS is available
        message.info("CSS file available for styling!", 1);
      } else {
        setActiveFile(Object.keys(newTemplateFiles)[0]);
      }
    }

    // Force a new Sandpack instance by updating the key
    setSandpackKey(Date.now());

    try {
      // Update the current code files based on selected language
      const newFiles = { ...LANGUAGE_TEMPLATES[value].files };
      console.log("New template files:", newFiles);

      // Special handling for JavaScript to fix preview issues
      if (
        value === "javascript" &&
        newFiles["/index.js"] &&
        !newFiles["/script.js"]
      ) {
        // Handle case when script.js might be missing but referenced in HTML
        const htmlContent = newFiles["/index.html"] || "";
        if (htmlContent.includes("script.js") && !newFiles["/script.js"]) {
          newFiles["/script.js"] = newFiles["/index.js"];
          delete newFiles["/index.js"];
          console.log("Fixed JavaScript file structure:", newFiles);
        }
      }

      // Update state and form fields
      setCurrentCode(newFiles);

      // Make sure form exists and has setFieldsValue method
      if (form && form.setFieldsValue) {
        form.setFieldsValue({
          language: value,
          defaultCode: newFiles,
          topic:
            (LANGUAGE_TEMPLATES[value]?.concepts &&
              LANGUAGE_TEMPLATES[value].concepts[0]) ||
            undefined,
        });
      }

      console.log("Updated currentCode state with new template:", newFiles);

      // Force Sandpack to re-render with new key
      setSandpackKey(Date.now());
    } catch (error) {
      console.error("Error in handleLanguageChange:", error);
      message.error("Failed to load template for selected language");
    }
  };

  const handleCreate = () => {
    setEditingAssignment(null);
    const defaultLanguage = "javascript";
    const defaultFiles = { ...LANGUAGE_TEMPLATES[defaultLanguage].files };

    // Make sure we have the right structure for JavaScript files
    if (
      defaultFiles["/index.html"] &&
      defaultFiles["/index.html"].includes("script.js") &&
      !defaultFiles["/script.js"]
    ) {
      if (defaultFiles["/index.js"]) {
        defaultFiles["/script.js"] = defaultFiles["/index.js"];
        delete defaultFiles["/index.js"];
      }
    }

    setCurrentCode(defaultFiles);
    setSandpackKey(Date.now());

    // Reset the code change counter
    codeChangeCount.current = 0;

    // Set the active file to the first file
    if (Object.keys(defaultFiles).length > 0) {
      // Try to find a CSS file first, as it's often what users want to edit
      const cssFile = Object.keys(defaultFiles).find((file) =>
        file.endsWith(".css"),
      );
      if (cssFile) {
        setActiveFile(cssFile);
      } else {
        setActiveFile(Object.keys(defaultFiles)[0]);
      }
    }

    form.resetFields();
    form.setFieldsValue({
      language: defaultLanguage,
      defaultCode: defaultFiles,
    });

    setModalVisible(true);
  };

  const handleEdit = (assignment) => {
    try {
      if (!assignment) {
        console.error("No assignment provided to edit");
        message.error("Failed to load assignment for editing");
        return;
      }

      setEditingAssignment(assignment);

      // Ensure we have proper files structure and language template exists
      let codeFiles = assignment.defaultCode;
      const language = assignment.language || "javascript";

      // Validate code files and fall back if needed
      if (
        !codeFiles ||
        typeof codeFiles !== "object" ||
        Object.keys(codeFiles).length === 0
      ) {
        console.warn(
          "Invalid code files in assignment, using template defaults",
        );
        codeFiles =
          LANGUAGE_TEMPLATES[language]?.files ||
          LANGUAGE_TEMPLATES.javascript.files;
      }

      // Make sure language template exists
      if (!LANGUAGE_TEMPLATES[language]) {
        console.warn(
          `Language template ${language} not found, falling back to JavaScript`,
        );
        codeFiles = { ...LANGUAGE_TEMPLATES.javascript.files };
      }

      setCurrentCode(codeFiles);
      setSandpackKey(Date.now());

      // Reset form first to clear any previous values
      form.resetFields();

      // Set form values with proper initialization and fallbacks
      form.setFieldsValue({
        title: assignment.title || "",
        description: assignment.description || "",
        language: language,
        level: assignment.metadata?.level || "beginner",
        topic:
          assignment.metadata?.topic ||
          (LANGUAGE_TEMPLATES[language]?.concepts &&
            LANGUAGE_TEMPLATES[language].concepts[0]),
        defaultCode: codeFiles,
        dueDate: assignment.dueDate ? assignment.dueDate : undefined,
      });

      setModalVisible(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
      message.error("Failed to load assignment for editing");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "assignments", id));
      message.success("Assignment deleted successfully");
      fetchAssignments();
    } catch (error) {
      message.error("Failed to delete assignment");
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Save change counter for stats but reset for next operation
      const changes = codeChangeCount.current;
      console.log("Total code changes before submission:", changes);
      codeChangeCount.current = 0;

      // Log current code state before submission
      console.log("Submitting assignment with code files:", currentCode);
      console.log("Form values:", values);

      // Validate that we have currentCode
      if (!currentCode || typeof currentCode !== "object") {
        throw new Error(
          "No valid code templates found. Please refresh and try again.",
        );
      }

      // Make sure any active file content is properly reflected in currentCode
      const cleanedCodeFiles = { ...currentCode };

      // Clean up any undefined or null values that might cause issues
      Object.keys(cleanedCodeFiles).forEach((key) => {
        if (!cleanedCodeFiles[key]) {
          delete cleanedCodeFiles[key];
        }
      });

      // Ensure we have at least one valid file
      if (Object.keys(cleanedCodeFiles).length === 0) {
        throw new Error(
          "No valid code files found. Please add at least one file template.",
        );
      }

      console.log("Cleaned code files for submission:", cleanedCodeFiles);

      // Validate required fields
      if (!values.title || !values.language) {
        throw new Error("Missing required fields (title or language)");
      }

      // Make sure to use the current code state which has the proper files
      const assignmentData = {
        ...values,
        defaultCode: cleanedCodeFiles, // Use the cleaned currentCode state
        createdAt: new Date(),
        status: "active",
        codeEdited: changes > 0, // Track if code was edited
        codeChangeCount: changes, // Store number of code edits
        lastEdited: new Date(),
        fileList: Object.keys(cleanedCodeFiles), // Store list of files for easier access
        activeFile: activeFile || Object.keys(cleanedCodeFiles)[0], // Store the active file
        lastModifiedFiles: Object.keys(cleanedCodeFiles).reduce((acc, file) => {
          acc[file] = new Date();
          return acc;
        }, {}), // Track file modification times
        // Add metadata for better categorization
        metadata: {
          language: values.language,
          topic: values.topic || "General",
          level: values.level || "beginner",
          tags: [values.language, values.topic, values.level].filter(Boolean),
          fileCount: Object.keys(cleanedCodeFiles).length,
        },
      };

      console.log("Full assignment data being saved:", assignmentData);

      if (editingAssignment) {
        await updateDoc(
          doc(db, "assignments", editingAssignment.id),
          assignmentData,
        );
        message.success("Assignment updated successfully with code templates");
        notification.success({
          message: "Code Templates Saved",
          description: `Successfully updated ${changes} code changes in the assignment templates.`,
          duration: 5,
        });
      } else {
        await addDoc(collection(db, "assignments"), assignmentData);
        message.success("Assignment created successfully with code templates");
        notification.success({
          message: "Code Templates Saved",
          description: `Successfully saved all code templates with ${changes} edits.`,
          duration: 5,
        });
      }

      setModalVisible(false);
      fetchAssignments();
    } catch (error) {
      const errorMessage = error.message || "Failed to save assignment";
      message.error(errorMessage);
      console.error("Error saving assignment:", error);

      // Show detailed error notification
      notification.error({
        message: "Failed to Save Code Templates",
        description: `Error: ${errorMessage}. Please try again or contact support if the issue persists.`,
        duration: 8,
      });
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          <CodeOutlined
            style={{ color: LANGUAGE_TEMPLATES[record.language]?.color }}
          />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      render: (language) => (
        <Tag
          color={LANGUAGE_TEMPLATES[language]?.color}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: 500,
          }}
        >
          {LANGUAGE_TEMPLATES[language]?.icon}{" "}
          {LANGUAGE_TEMPLATES[language]?.name}
        </Tag>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (
        <Space>
          <ClockCircleOutlined />
          <span>{new Date(date).toLocaleDateString()}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "active" ? "green" : "default"}
          icon={status === "active" ? <CheckCircleOutlined /> : null}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: 500,
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
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
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredAssignments =
    activeTab === "all"
      ? assignments
      : assignments.filter((a) => a.language === activeTab);

  const LEVELS = [
    { value: "beginner", label: "Beginner", color: "green" },
    { value: "intermediate", label: "Intermediate", color: "blue" },
    { value: "advanced", label: "Advanced", color: "red" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          background: "#fff",
        }}
      >
        <PageHeader
          title="Assignment Management"
          subtitle="Create and manage programming assignments"
          breadcrumbs={[
            "Assignments",
            editingAssignment
              ? "Edit Assignment: " + editingAssignment.title
              : "Create New Assignment"
          ]}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Create Assignment
            </Button>
          }
        />

        <div style={{ marginBottom: 24 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "all", label: "All Assignments" },
              ...Object.entries(LANGUAGE_TEMPLATES).map(([key, lang]) => ({
                key,
                label: (
                  <Space>
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </Space>
                ),
              })),
            ]}
          />
        </div>

        <Table
          dataSource={filteredAssignments}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} assignments`,
          }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={
          <Title level={4} style={{ margin: 0, color: BRAND_COLOR }}>
            {editingAssignment ? "Edit Assignment" : "Create Assignment"}
          </Title>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setCurrentCode(LANGUAGE_TEMPLATES.javascript.files);
          codeChangeCount.current = 0;
        }}
        footer={null}
        width={1200}
        style={{ top: 20 }}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            language: "javascript",
            level: "beginner",
          }}
          style={{ padding: "0 10px" }}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: "Please enter assignment title" },
                ]}
              >
                <Input placeholder="Enter assignment title" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label={<span style={{ fontWeight: "bold" }}>Description</span>}
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "8px 12px",
                      borderBottom: "1px solid #d9d9d9",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    Markdown Editor
                  </div>
                  <TextArea
                    rows={6}
                    placeholder="Write your description in markdown format..."
                    style={{
                      border: "none",
                      borderRadius: 0,
                      fontFamily: "monospace",
                    }}
                    value={form.getFieldValue("description")}
                    onChange={(e) => {
                      form.setFieldsValue({ description: e.target.value });
                    }}
                  />
                </div>
              </Form.Item>
              <div
                style={{
                  marginTop: "8px",
                  padding: "16px",
                  background: "#fafafa",
                  borderRadius: "6px",
                  border: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "8px",
                  }}
                >
                  Preview
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  <ReactMarkdown>
                    {form.getFieldValue("description") || ""}
                  </ReactMarkdown>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <Form.Item
                name="language"
                label={
                  <span style={{ fontWeight: "bold" }}>
                    Programming Language
                  </span>
                }
                rules={[{ required: true, message: "Please select language" }]}
              >
                <Select
                  placeholder="Select language"
                  onChange={handleLanguageChange}
                >
                  {Object.entries(LANGUAGE_TEMPLATES).map(([key, lang]) => (
                    <Select.Option key={key} value={key}>
                      <Space>
                        <span>{lang.icon}</span>
                        <span>{lang.name}</span>
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="topic"
                label="Topic"
                rules={[{ required: true, message: "Please select a topic" }]}
              >
                <Select
                  placeholder="Select topic"
                  disabled={!form.getFieldValue("language")}
                >
                  {(
                    LANGUAGE_TEMPLATES[form.getFieldValue("language")]
                      ?.concepts || []
                  ).map((topic) => (
                    <Select.Option key={topic} value={topic}>
                      {topic}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="level"
                label="Difficulty Level"
                rules={[
                  { required: true, message: "Please select difficulty level" },
                ]}
              >
                <Select placeholder="Select level">
                  {LEVELS.map((level) => (
                    <Select.Option key={level.value} value={level.value}>
                      <Tag color={level.color}>{level.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: "Please select due date" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="defaultCode"
                label={
                  <span style={{ fontWeight: "bold" }}>
                    Default Code Template
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter default code" },
                ]}
                extra={
                  <span>
                    This code template will be provided to students when they
                    start the assignment.{" "}
                    <strong>
                      Changes are automatically saved as you type.
                    </strong>
                  </span>
                }
              >
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    overflow: "hidden",
                    minHeight: "650px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  <SandpackProvider
                    key={sandpackKey}
                    template={
                      LANGUAGE_TEMPLATES[form.getFieldValue("language")]
                        ?.template || "vanilla"
                    }
                    files={currentCode}
                    theme="light"
                    options={{
                      recompileMode: "delayed",
                      recompileDelay: 500,
                      showNavigator: true,
                      showTabs: true,
                      editorHeight: 600,
                      activeFile: activeFile || Object.keys(currentCode)[0],
                      visibleFiles: Object.keys(currentCode),
                      classes: {
                        "sp-tab-button": "sp-tab",
                      },
                    }}
                    customSetup={{
                      dependencies:
                        form.getFieldValue("language") === "react"
                          ? {
                              react: "^18.0.0",
                              "react-dom": "^18.0.0",
                            }
                          : {},
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={16}>
                        <SandpackCodeEditorWrapper
                          key={`editor-${sandpackKey}`}
                          setCurrentCode={setCurrentCode}
                          currentCode={
                            currentCode || LANGUAGE_TEMPLATES.javascript.files
                          }
                          setActiveFile={setActiveFile}
                          form={form}
                          codeChangeCount={codeChangeCount}
                        />
                        <div
                          style={{
                            padding: "12px",
                            backgroundColor: "#f5f5f5",
                            borderTop: "1px solid #e8e8e8",
                          }}
                        >
                          <Text type="secondary">
                            <b>Code changes are automatically saved.</b> Edit
                            any file to update the template. <br />
                            <span style={{ fontSize: "12px" }}>
                              • Changes made: <b>{codeChangeCount.current}</b> |
                              Active file: <b>{activeFile || "None"}</b>
                            </span>
                            <br />
                            <span
                              style={{ fontSize: "12px", color: "#1890ff" }}
                            >
                              • Use the <b>file tabs</b> to switch between files
                              (<Tag color="#f50">CSS files for styling</Tag>)
                            </span>
                            <br />
                            <span style={{ fontSize: "12px" }}>
                              • Students will receive this exact code template
                              when they start the assignment (including CSS
                              files)
                            </span>
                            <br />
                            <span style={{ fontSize: "12px" }}>
                              • Templates will work with the Sandpack code
                              editor in student's practice page
                            </span>
                            <br />
                            <span style={{ fontSize: "12px" }}>
                              • You can add or modify files using the tabs in
                              the editor
                            </span>
                          </Text>
                        </div>
                      </Col>
                      <Col span={8}>
                        <SandpackPreview
                          showNavigator={true}
                          showRefreshButton={true}
                          showOpenInCodeSandbox={false}
                          style={{
                            height: "600px",
                            border: "1px solid #e8e8e8",
                            borderRadius: "4px",
                          }}
                        />
                      </Col>
                    </Row>
                  </SandpackProvider>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: "right", marginTop: 24, marginBottom: 16 }}>
            <Space size="middle">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setCurrentCode(LANGUAGE_TEMPLATES.javascript.files);
                  codeChangeCount.current = 0;
                }}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={
                  editingAssignment ? <CheckCircleOutlined /> : <PlusOutlined />
                }
              >
                {editingAssignment ? "Update Assignment" : "Create Assignment"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
