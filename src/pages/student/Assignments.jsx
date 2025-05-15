import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';
import PracticeLayout from '../../components/student/PracticeLayout';
import ProblemStatement from '../../components/student/ProblemStatement';
import PracticeSandpack from '../../components/student/PracticeSandpack';
import { Tab } from '@headlessui/react';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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

  const getFilteredAssignments = (filter) => {
    switch (filter) {
      case 'pending':
        return assignments.filter(a => !a.submitted);
      case 'completed':
        return assignments.filter(a => a.submitted);
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
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[difficulty]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  if (selectedAssignment) {
    return (
      <div className="h-screen">
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <button
            onClick={() => setSelectedAssignment(null)}
            className="flex items-center text-gray-600 hover:text-[#3b82f6] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Assignments
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{selectedAssignment.title}</h1>
        </div>
        <PracticeLayout>
          <ProblemStatement markdown={selectedAssignment.problemStatement} />
          <PracticeSandpack starterCode={selectedAssignment.sampleCode} />
        </PracticeLayout>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-1">Track and manage your learning progress</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
          <AcademicCapIcon className="h-5 w-5 text-[#3b82f6]" />
          <span>{assignments.length} Total Assignments</span>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-8">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center space-x-2',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#3b82f6] focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-[#3b82f6] shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#3b82f6]'
              )
            }
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>All Assignments</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center space-x-2',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#3b82f6] focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-[#3b82f6] shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#3b82f6]'
              )
            }
          >
            <ClockIcon className="h-5 w-5" />
            <span>Pending</span>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center space-x-2',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#3b82f6] focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-[#3b82f6] shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#3b82f6]'
              )
            }
          >
            <CheckCircleIcon className="h-5 w-5" />
            <span>Completed</span>
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {['all', 'pending', 'completed'].map((filter) => (
            <Tab.Panel key={filter}>
              <div className="space-y-4">
                {getFilteredAssignments(filter).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] text-white">
                              <BookOpenIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900">{assignment.title}</h2>
                              <div className="flex items-center space-x-2 mt-1">
                                {getDifficultyBadge(assignment.difficulty)}
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                  assignment.submitted
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {assignment.submitted ? 'Completed' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 ml-13">{assignment.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 ml-13">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-[#3b82f6]" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            {assignment.submitted && (
                              <div className="flex items-center">
                                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                                Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="ml-4 flex items-center px-4 py-2 bg-gradient-to-r from-[#3b82f6] to-[#1e3a8a] text-white rounded-lg hover:from-[#1e3a8a] hover:to-[#3b82f6] transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <PlayIcon className="h-4 w-4 mr-2" />
                          {assignment.submitted ? 'Review' : 'Start'}
                          <ArrowRightIcon className="h-4 w-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}