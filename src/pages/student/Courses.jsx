import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function StudentCourses() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, 'enrollments'),
          where('studentId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const courseList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(courseList);
      } catch (error) {
        toast.error('Failed to fetch courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">Track your learning progress and access course materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-[#0284c7] to-[#0369a1]"></div>
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  course.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Progress: {course.progress || 0}%
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {course.assignmentCount || 0} Assignments
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#0284c7] h-2 rounded-full" 
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button className="text-[#0284c7] hover:text-[#0369a1] text-sm font-medium">
                  View Materials
                </button>
                <button className="text-[#0284c7] hover:text-[#0369a1] text-sm font-medium">
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 