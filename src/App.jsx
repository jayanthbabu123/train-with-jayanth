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

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import StudentAssignments from "./pages/student/Assignments";
import StudentProfile from "./pages/student/Profile";
import Home from "./pages/Home/Home";
import StudentPractice from "./pages/student/Practice";
import StudentBatches from "./pages/student/Batches";
import TrainerVideoUpload from "./pages/trainer/TrainerVideoUpload";
import StudentVideos from "./pages/student/Videos";

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
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="practice" element={<StudentPractice />} />
                <Route path="batches" element={<StudentBatches />} />
                <Route path="videos" element={<StudentVideos />} />
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
