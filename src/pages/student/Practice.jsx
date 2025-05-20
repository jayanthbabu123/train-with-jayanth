import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import {
  message,
  Spin,
  Button,
  Card,
  Progress,
  Space,
  Typography,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import PracticeLayout from "../../components/student/PracticeLayout";
import ProblemStatement from "../../components/student/ProblemStatement";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { freeCodeCampDark } from "@codesandbox/sandpack-themes";
import { LANGUAGE_TEMPLATES } from "../../config/languageTemplates";

const { Title, Text } = Typography;

// Component that uses Sandpack hooks
const CodeEditorWithSubmit = forwardRef(({ readOnly }, ref) => {
  const { sandpack } = useSandpack();
  const { files } = sandpack;

  useImperativeHandle(ref, () => ({
    getFiles: () => {
      return Object.keys(files).reduce((acc, filePath) => {
        const fileData = files[filePath];
        acc[filePath] = {
          code: fileData.code,
          hidden: fileData.hidden || false,
          active: fileData.active || false,
          readOnly: fileData.readOnly || false,
        };
        return acc;
      }, {});
    },
  }));

  return (
    <SandpackCodeEditor
      showLineNumbers
      showTabs
      wrapContent
      showRunButton
      showCompileButton
      style={{ height: "100%", width: "100%", flex: 1, background: '#181818' }}
      readOnly={readOnly}
    />
  );
});

// Wrapper component that provides the layout
const SandpackEditor = forwardRef(({ readOnly }, ref) => {
  return (
    <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0, height: "100%" }}>
      <Panel
        defaultSize={50}
        minSize={25}
        maxSize={75}
        style={{
          minWidth: 220,
          maxWidth: "80%",
          height: "100%",
          minHeight: 0,
          width: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          background: "#1a1a1a",
          borderRight: "1px solid #333",
        }}
      >
        <CodeEditorWithSubmit ref={ref} readOnly={readOnly} />
      </Panel>
      <PanelResizeHandle
        style={{
          width: 8,
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "col-resize",
        }}
      >
        <div
          style={{
            width: 2,
            height: 32,
            borderRadius: 1,
            background: "#333",
          }}
        />
      </PanelResizeHandle>
      <Panel
        minSize={25}
        style={{
          minWidth: 0,
          height: "100%",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            borderBottom: "1px solid #e8e8e8",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SandpackPreview
            style={{
              height: "100%",
              overflow: "auto",
              minHeight: 0,
              flex: 1,
            }}
          />
        </div>
        <div
          style={{
            height: "40%",
            minHeight: 0,
            background: "#181818",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SandpackConsole
            style={{
              height: "100%",
              background: "inherit",
              overflow: "auto",
              minHeight: 0,
              flex: 1,
            }}
            standalone={false}
            showHeader={true}
          />
        </div>
      </Panel>
    </PanelGroup>
  );
});

export default function Practice() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [code, setCode] = useState({});
  const [userData, setUserData] = useState(null);
  const [submissionStats, setSubmissionStats] = useState({
    totalStudents: 0,
    submittedCount: 0,
  });
  const isReviewMode = location.state?.mode === "review";
  const sandpackRef = useRef();

  useEffect(() => {
    fetchUserData();
    fetchAssignment();
    fetchSubmissionStats();
  }, [id]);

  const fetchUserData = async () => {
    try {
      if (!currentUser?.uid) return;
      
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchAssignment = async () => {
    try {
      const docRef = doc(db, "assignments", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const assignmentData = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        setAssignment(assignmentData);

        if (isReviewMode) {
          // Fetch from submissions collection
          const submissionRef = doc(
            db,
            "submissions",
            `${id}_${currentUser.uid}`
          );
          const submissionSnap = await getDoc(submissionRef);
          
          if (submissionSnap.exists()) {
            const submissionData = submissionSnap.data();
            setCode(submissionData.code || {});
          } else {
            message.error("Submission not found");
            navigate("/student/assignments");
          }
        } else {
          // Initialize with template code
          const template = LANGUAGE_TEMPLATES[assignmentData.language];
          if (template && template.files) {
            setCode(template.files);
          } else {
            // Fallback to default code from assignment
            setCode(assignmentData.defaultCode || {});
          }
        }
      } else {
        message.error("Assignment not found");
        navigate("/student/assignments");
      }
    } catch (error) {
      message.error("Failed to fetch assignment");
      console.error("Error:", error);
      navigate("/student/assignments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionStats = async () => {
    try {
      // Get all students in the same batch
      const studentsQuery = query(
        collection(db, "users"),
        where("role", "==", "student"),
        where("batchId", "==", currentUser.batchId)
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      const totalStudents = studentsSnapshot.size;

      // Get submissions for this assignment
      const submissionsQuery = query(
        collection(db, "submissions"),
        where("assignmentId", "==", id)
      );
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const submittedCount = submissionsSnapshot.size;

      setSubmissionStats({
        totalStudents,
        submittedCount,
      });
    } catch (error) {
      console.error("Error fetching submission stats:", error);
    }
  };

  const handleSubmitClick = () => {
    if (sandpackRef.current && sandpackRef.current.getFiles) {
      const submittedFiles = sandpackRef.current.getFiles();
      handleSubmit(submittedFiles);
    } else {
      message.error("Could not read code files from editor");
    }
  };

  const handleSubmit = async (submittedFiles) => {
    try {
      // Validate required fields
      if (!currentUser?.uid) {
        message.error("User not authenticated");
        return;
      }

      if (!userData?.batchId) {
        message.error("Batch ID not found. Please contact your trainer.");
        return;
      }

      console.log("Submitting files:", submittedFiles);

      const submission = {
        // User details
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        userEmail: currentUser.email,
        batchId: userData.batchId,
        batchName: userData.batchName,

        // Assignment details
        assignmentId: id,
        assignmentTitle: assignment.title,
        assignmentDescription: assignment.description,
        language: assignment.language,

        // Submission details
        code: submittedFiles,
        submittedAt: new Date(),
        status: "submitted",
        
        // Additional metadata
        lastModified: new Date(),
        version: 1,
        isLatest: true,
      };

      // Add to submissions collection with a unique ID
      const submissionId = `${id}_${currentUser.uid}`;
      await setDoc(doc(db, "submissions", submissionId), submission);

      message.success("Assignment submitted successfully");
      navigate("/student/assignments");
    } catch (error) {
      message.error("Failed to submit assignment");
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  const template = LANGUAGE_TEMPLATES[assignment.language];
  const submissionPercentage =
    (submissionStats.submittedCount / submissionStats.totalStudents) * 100;

  return (
    <div style={{ height: "calc(100vh - 32px)" }}>
      <Card style={{ marginBottom: 16, borderRadius: 8 }} bodyStyle={{ padding: 0 }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/student/assignments")}
              >
                Back to Assignments
              </Button>
              <Title level={3} style={{ margin: 0 }}>
                {assignment.title}
              </Title>
              {isReviewMode && (
                <Tag color="blue" icon={<EyeOutlined />}>
                  Review Mode
                </Tag>
              )}
            </Space>
            <Space>
              <Text type="secondary">
                <ClockCircleOutlined /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </Text>
              <Progress
                type="circle"
                percent={Math.round(submissionPercentage)}
                width={40}
                format={(percent) =>
                  `${submissionStats.submittedCount}/${submissionStats.totalStudents}`
                }
              />
            </Space>
          </div>
        </Space>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 80px)' }}>
        {/* Problem Statement Row */}
        <Card 
          style={{ 
            marginBottom: 16, 
            borderRadius: 8,
            maxHeight: '30%',
            overflow: 'auto'
          }}
          bodyStyle={{ padding: 0 }}
        >
          <ProblemStatement markdown={assignment.description} />
        </Card>

        {/* Code Editor and Preview Row */}
        <Card
          bordered={false}
          style={{
            flex: 1,
            background: "#1a1a1a",
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SandpackProvider
            template={template.template}
            files={code}
            theme={freeCodeCampDark}
            options={{
              recompileMode: "delayed",
              recompileDelay: 1000,
              editorHeight: 280,
              editorWidthPercentage: 60,
              activeFile: "/index.html",
              visibleFiles: ["/index.html", "/index.js"],
            }}
          >
            <SandpackEditor ref={sandpackRef} readOnly={isReviewMode} />
          </SandpackProvider>
        </Card>

        {/* Submit Button */}
        {!isReviewMode && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmitClick}
            >
              Submit Assignment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 
