import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
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
  // Add more batches as needed
];

export default function StudentBatches() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [form, setForm] = useState({ name: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchRegistrations();
    }
  }, [currentUser]);

  const fetchRegistrations = async () => {
    try {
      const q = query(
        collection(db, 'batch_registrations'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const registrationList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistrations(registrationList);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleJoin = (batch) => {
    if (!currentUser) {
      toast('Please login to register for a batch.');
      navigate('/login');
      return;
    }
    setSelectedBatch(batch);
    setForm({ name: currentUser.displayName || '', mobile: '' });
    setShowModal(true);
  };

  const handleRegister = async () => {
    if (!form.name.trim() || !form.mobile.trim()) {
      toast.error('Please provide your full name and mobile number.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'batch_registrations'), {
        userId: currentUser.uid,
        batchId: selectedBatch.id,
        batchName: selectedBatch.name,
        name: form.name,
        mobile: form.mobile,
        status: 'pending',
        registeredAt: serverTimestamp(),
      });
      toast.success('Registration submitted! The trainer will contact you shortly.');
      setShowModal(false);
      fetchRegistrations(); // Refresh registrations
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRegistrationStatus = (batchId) => {
    const registration = registrations.find(reg => reg.batchId === batchId);
    if (!registration) return null;
    return registration.status;
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#0284c7]">Available Batches</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {batches.map((batch) => {
            const status = getRegistrationStatus(batch.id);
            return (
              <div key={batch.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center relative">
                <div className="text-5xl mb-4">{batch.icon}</div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">{batch.name}</h2>
                <p className="text-gray-600 mb-4">{batch.description}</p>
                <div className="mb-4 text-sm text-gray-500">Start Date: <span className="font-semibold text-[#0284c7]">{batch.start}</span></div>
                {status ? (
                  <div className="mt-2">
                    {getStatusBadge(status)}
                    {status === 'pending' && (
                      <p className="text-sm text-gray-500 mt-2">Trainer will contact you shortly</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoin(batch)}
                    className="px-6 py-2 bg-[#0284c7] text-white rounded-lg font-semibold hover:bg-[#0369a1] transition-colors shadow"
                  >
                    Join
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal for registration */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-[#0284c7]">Register for {selectedBatch?.name}</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  placeholder="Enter your mobile number"
                />
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full px-6 py-3 bg-[#0284c7] text-white rounded-lg font-semibold hover:bg-[#0369a1] transition-colors shadow disabled:opacity-60"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 