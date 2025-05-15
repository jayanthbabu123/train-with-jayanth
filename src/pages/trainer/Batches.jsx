import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';

const batches = [
  {
    id: 'mern',
    name: 'MERN Stack',
    icon: '🟩',
    start: '2024-06-20',
    description: 'Full-stack web development with MongoDB, Express, React, and Node.js.'
  },
  {
    id: 'react',
    name: 'React.js Batch',
    icon: '⚛️',
    start: '2024-06-25',
    description: 'Master React.js for building modern user interfaces.'
  },
  {
    id: 'html',
    name: 'HTML Batch',
    icon: '📄',
    start: '2024-07-01',
    description: 'Learn the fundamentals of HTML for web development.'
  },
  {
    id: 'css',
    name: 'CSS Batch',
    icon: '🎨',
    start: '2024-07-05',
    description: 'Style beautiful websites with modern CSS.'
  },
];

export default function TrainerBatches() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const q = query(collection(db, 'batch_registrations'));
      const querySnapshot = await getDocs(q);
      const registrationList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistrations(registrationList);
    } catch (error) {
      toast.error('Failed to fetch registrations');
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'batch_registrations', registrationId), {
        status: newStatus
      });
      toast.success('Status updated successfully');
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const getRegistrationsForBatch = (batchId) => {
    return registrations.filter(reg => reg.batchId === batchId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => {
          const batchRegistrations = getRegistrationsForBatch(batch.id);
          const pendingCount = batchRegistrations.filter(reg => reg.status === 'pending').length;
          
          return (
            <div key={batch.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{batch.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">Start Date: {batch.start}</p>
                  </div>
                  <div className="text-4xl">{batch.icon}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Registrations:</span>
                    <span className="font-semibold">{batchRegistrations.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pending Reviews:</span>
                    <span className="font-semibold text-yellow-600">{pendingCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBatch(batch)}
                  className="mt-4 w-full px-4 py-2 bg-[#0284c7] text-white rounded-lg hover:bg-[#0369a1] transition-colors"
                >
                  View Registrations
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedBatch.name} - Registrations
              </h2>
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getRegistrationsForBatch(selectedBatch.id).map((registration) => (
                    <tr key={registration.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {registration.registeredAt?.toDate().toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(registration.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {registration.status === 'pending' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(registration.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(registration.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 