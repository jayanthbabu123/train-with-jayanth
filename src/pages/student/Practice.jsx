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
  FullscreenOutlined,
  FullscreenExitOutlined,
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
    <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 600, height: "100%" }}>
      <Panel
        defaultSize={50}
        minSize={25}
        maxSize={75}
        style={{
          minWidth: 220,
          maxWidth: "80%",
          height: "100%",
          minHeight: 600,
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
          minHeight: 600,
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
  const [fullscreen, setFullscreen] = useState(false);

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
          // First try to use the assignment's defaultCode if available
          if (assignmentData.defaultCode && typeof assignmentData.defaultCode === 'object' && Object.keys(assignmentData.defaultCode).length > 0) {
            console.log('Using assignment default code:', assignmentData.defaultCode);
            setCode(assignmentData.defaultCode);
          } else {
            // Fallback to language template if no defaultCode is available
            console.log('No defaultCode found, using language template');
            const template = LANGUAGE_TEMPLATES[assignmentData.language];
            if (template && template.files) {
              setCode(template.files);
            } else {
              // Ultimate fallback to JavaScript if nothing else works
              setCode(LANGUAGE_TEMPLATES.javascript.files);
            }
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
      try {
        const submittedFiles = sandpackRef.current.getFiles();
        console.log('Submitting files:', submittedFiles);
        handleSubmit(submittedFiles);
      } catch (error) {
        console.error('Error getting files from Sandpack:', error);
        message.error('Failed to prepare submission. Please try again.');
      }
    } else {
      message.error("Could not read code files from editor");
    }
  };

  const handleSubmit = async (submittedFiles) => {
    console.log('Handling submission with files:', submittedFiles);
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
    <div >
      {!fullscreen && (
        <Card style={{ marginBottom: 16, borderRadius: 8 }} >
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
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tag color={LANGUAGE_TEMPLATES[assignment.language]?.color}>
                {LANGUAGE_TEMPLATES[assignment.language]?.icon} {LANGUAGE_TEMPLATES[assignment.language]?.name}
              </Tag>
              {assignment.metadata?.topic && (
                <Tag color="blue">{assignment.metadata.topic}</Tag>
              )}
              {assignment.metadata?.level && (
                <Tag 
                  color={
                    assignment.metadata.level === 'beginner' ? 'green' :
                    assignment.metadata.level === 'intermediate' ? 'blue' :
                    'red'
                  }
                >
                  {assignment.metadata.level.charAt(0).toUpperCase() + assignment.metadata.level.slice(1)}
                </Tag>
              )}
            </div>
          </Space>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Problem Statement Row */}
        {!fullscreen && (
          <Card 
            style={{ 
              marginBottom: 16, 
              borderRadius: 8,
              maxHeight: '400px',
              overflow: 'auto'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <ProblemStatement markdown={assignment.description} />
          </Card>
        )}

        {/* Code Editor and Preview Row */}
        <Card
          bordered={false}
          style={{
            flex: 1,
            background: "#1a1a1a",
            borderRadius: 8,
            overflow: fullscreen ? "auto" : "hidden",
            display: "flex",
            flexDirection: "column",
            height: fullscreen ? "100vh" : "auto",
            minHeight: fullscreen ? "100vh" : 600,
            zIndex: fullscreen ? 1001 : 'auto',
            position: fullscreen ? 'fixed' : 'relative',
            top: fullscreen ? 0 : 'auto',
            left: fullscreen ? '50%' : 'auto',
            transform: fullscreen ? 'translateX(-50%)' : 'none',
            width: fullscreen ? '95%' : '100%',
            maxWidth: fullscreen ? '1800px' : '100%',
            boxShadow: fullscreen ? '0 0 0 9999px rgba(0,0,0,0.85)' : undefined,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: fullscreen ? '12px 20px' : '8px 16px', 
            background: fullscreen ? '#23272f' : 'transparent', 
            zIndex: 2, 
            borderBottom: fullscreen ? '1px solid #333' : undefined,
            borderRadius: fullscreen ? '8px 8px 0 0' : 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {fullscreen && (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 500 }}>
                  {assignment.title}
                </Text>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {fullscreen && !isReviewMode && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleSubmitClick}
                  style={{ 
                    fontWeight: 600,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0 16px',
                    borderRadius: '8px',
                    background: '#0067b8',
                    border: 'none',
                  }}
                  className="hover-effect"
                >
                  Submit
                </Button>
              )}
              <Button
                type="text"
                icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={() => setFullscreen(f => !f)}
                style={{ 
                  color: fullscreen ? '#fff' : '#666',
                  fontSize: 18,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  background: fullscreen ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none',
                  padding: 0,
                  marginLeft: 'auto',
                }}
                className="hover-effect"
              />
            </div>
          </div>
          <div style={{ 
            flex: 1, 
            minHeight: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'auto', 
            borderRadius: fullscreen ? '0 0 8px 8px' : 0,
            background: '#1a1a1a',
          }}>
            <SandpackProvider
              template={template?.template || 'vanilla'}
              files={code}
              theme={freeCodeCampDark}
              options={{
                recompileMode: "delayed",
                recompileDelay: 1000,
                editorHeight: fullscreen ? 'calc(100vh - 60px)' : 600,
                editorWidthPercentage: 60,
                activeFile: Object.keys(code)[0] || "/index.html",
                visibleFiles: Object.keys(code) || ["/index.html", "/index.js"],
              }}
            >
              <SandpackEditor ref={sandpackRef} readOnly={isReviewMode} />
            </SandpackProvider>
          </div>
        </Card>
      </div>

      {/* Submit Assignment Button in Default View */}
      {!fullscreen && !isReviewMode && (
        <div style={{ 
          marginTop: 16, 
          marginBottom: 48,
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '0 16px'
        }}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleSubmitClick}
            style={{ 
              fontWeight: 600,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 24px',
              borderRadius: '8px',
              background: '#0067b8',
              border: 'none',
              minWidth: 180,
            }}
            className="hover-effect"
          >
            Submit Assignment
          </Button>
        </div>
      )}
    </div>
  );
}

<style>
  {`
    .hover-effect:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .hover-effect:active {
      transform: translateY(0);
    }
    .hover-effect:hover {
      background: rgba(255,255,255,0.15) !important;
    }
  `}
</style>
