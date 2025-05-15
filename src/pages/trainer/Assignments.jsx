import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import AssignmentEditor from '../../components/AssignmentEditor';

export default function TrainerAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, draft

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const q = query(collection(db, 'assignments'));
      const querySnapshot = await getDocs(q);
      const assignmentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignments(assignmentList);
    } catch (error) {
      toast.error('Failed to fetch assignments');
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssignment = async (data) => {
    if (!data) {
      setShowEditor(false);
      return;
    }

    try {
      await addDoc(collection(db, 'assignments'), {
        ...data,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Assignment created successfully');
      setShowEditor(false);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to create assignment');
      console.error('Error creating assignment:', error);
    }
  };

  const getFilteredAssignments = () => {
    switch (filter) {
      case 'active':
        return assignments.filter(a => a.status === 'active');
      case 'draft':
        return assignments.filter(a => a.status === 'draft');
      default:
        return assignments;
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[difficulty]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0284c7]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
        <button
          onClick={() => setShowEditor(true)}
          className="bg-[#0284c7] text-white px-4 py-2 rounded-lg hover:bg-[#0369a1] transition-colors"
        >
          Create New Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-[#0284c7] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'active'
              ? 'bg-[#0284c7] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'draft'
              ? 'bg-[#0284c7] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredAssignments().map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{assignment.title}</h2>
                  <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getDifficultyBadge(assignment.difficulty)}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    assignment.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {assignment.submittedCount || 0} Submissions
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowEditor(true);
                  }}
                  className="text-[#0284c7] hover:text-[#0369a1] text-sm font-medium"
                >
                  Edit
                </button>
                <button className="text-[#0284c7] hover:text-[#0369a1] text-sm font-medium">
                  View Submissions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <AssignmentEditor
              initialData={selectedAssignment}
              onSave={handleSaveAssignment}
            />
          </div>
        </div>
      )}
    </div>
  );
} 