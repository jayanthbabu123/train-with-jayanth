// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Auth Pages
import Login from "./pages/auth/Login";

// Public Pages
import Unauthorized from "./pages/auth/Unauthorized";

// Trainer Pages
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerStudents from "./pages/trainer/Students";
import TrainerBatches from "./pages/trainer/Batches";
import TrainerMaterials from "./pages/trainer/Materials";
import TrainerAssignments from "./pages/trainer/Assignments";
import TrainerVideoUpload from "./pages/trainer/TrainerVideoUpload";
import Submissions from './pages/trainer/Submissions';
import ReviewSubmission from './pages/trainer/ReviewSubmission';
import Courses from './pages/trainer/Courses';
import CourseDetails from './pages/trainer/CourseDetails';
import TrainerEnrollments from './pages/trainer/Enrollments';
import TrainerFeed from './pages/trainer/TrainerFeed';
import TrainerQuizzes from './pages/trainer/Quizzes';
import QuizzesByLanguage from './pages/trainer/QuizzesByLanguage';

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import StudentAssignments from "./pages/student/Assignments";
import StudentProfile from "./pages/student/Profile";
import Home from "./pages/Home/Home";
import Practice from "./pages/student/Practice";
import StudentBatches from "./pages/student/Batches";
import StudentVideos from "./pages/student/Videos";
import StudentCourseDetails from "./pages/student/CourseDetails";
import StudentQuizzes from "./pages/student/Quizzes";
import StudentQuizzesByLanguage from "./pages/student/QuizzesByLanguage";

// Protected Route component
function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Trainer Routes */}
      <Route
        path="/trainer/*"
        element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<TrainerDashboard />} />
                <Route path="students" element={<TrainerStudents />} />
                <Route path="batches" element={<TrainerBatches />} />
                <Route path="materials" element={<TrainerMaterials />} />
                <Route path="assignments" element={<TrainerAssignments />} />
                <Route path="video-upload" element={<TrainerVideoUpload />} />
                <Route path="submissions" element={<Submissions />} />
                <Route path="review/:id" element={<ReviewSubmission />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseDetails />} />
                <Route path="enrollments" element={<TrainerEnrollments />} />
                <Route path="feed" element={<TrainerFeed />} />
                <Route path="quizzes" element={<TrainerQuizzes />} />
                <Route path="quizzes/:language" element={<QuizzesByLanguage />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route path="courses/:id" element={<StudentCourseDetails />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="practice/:id" element={<Practice />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="batches" element={<StudentBatches />} />
                <Route path="videos" element={<StudentVideos />} />
                <Route path="quizzes" element={<StudentQuizzes />} />
                <Route path="quizzes/:language" element={<StudentQuizzesByLanguage />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
