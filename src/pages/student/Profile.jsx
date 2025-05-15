import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    education: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({
            ...prev,
            ...docSnap.data(),
            skills: Array.isArray(docSnap.data().skills) ? docSnap.data().skills : [],
          }));
        }
      } catch (error) {
        toast.error('Failed to fetch profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser.uid]);

  const handleUpdateProfile = async () => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, profile);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <button
                onClick={() => setEditing(!editing)}
                className="text-[#0284c7] hover:text-[#0369a1] font-medium"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-[#0284c7]/10 flex items-center justify-center">
                  <img
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName}`}
                    alt={currentUser.displayName}
                    className="w-20 h-20 rounded-full"
                  />
                </div>
                {editing && (
                  <button className="text-[#0284c7] hover:text-[#0369a1] text-sm font-medium">
                    Change Photo
                  </button>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {editing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio || 'No bio provided'}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0284c7]/10 text-[#0284c7]"
                    >
                      {skill}
                      {editing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-[#0284c7] hover:text-[#0369a1]"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {editing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-[#0284c7] text-white rounded-lg hover:bg-[#0369a1] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                {editing ? (
                  <textarea
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                ) : (
                  <p className="text-gray-900">{profile.education || 'No education details provided'}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                {editing ? (
                  <textarea
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                ) : (
                  <p className="text-gray-900">{profile.experience || 'No experience details provided'}</p>
                )}
              </div>

              {/* Save Button */}
              {editing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateProfile}
                    className="px-6 py-2 bg-[#0284c7] text-white rounded-lg hover:bg-[#0369a1] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 