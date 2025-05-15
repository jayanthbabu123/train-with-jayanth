import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    completedAssignments: 0,
    upcomingSessions: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch assignments
        const assignmentsQuery = query(
          collection(db, 'assignments'),
          where('studentId', '==', currentUser.uid)
        );
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        const completedAssignments = assignmentsSnapshot.docs.filter(
          doc => doc.data().status === 'completed'
        ).length;

        // Fetch upcoming sessions
        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('studentId', '==', currentUser.uid),
          where('status', '==', 'upcoming')
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const upcomingSessions = sessionsSnapshot.docs.length;

        // Fetch courses
        const coursesQuery = query(
          collection(db, 'enrollments'),
          where('studentId', '==', currentUser.uid)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const totalCourses = coursesSnapshot.docs.length;

        setStats({
          completedAssignments,
          upcomingSessions,
          totalCourses
        });
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser.uid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0284c7]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.displayName}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your learning progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-[#0284c7]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Completed Assignments</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Upcoming Sessions</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.upcomingSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Enrolled Courses</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-600">No recent activity to show</p>
        </div>
      </div>
    </div>
  );
} 