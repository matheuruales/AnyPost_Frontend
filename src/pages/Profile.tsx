import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/ui/Loader';
import api from '../services/api';

interface ProfileData {
  displayName?: string;
  bio?: string;
  website?: string;
}

const Profile: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await api.put('/profile', profile);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-primary-card p-6 rounded-lg border border-primary-border">
            <h1 className="text-2xl font-bold text-primary-text mb-6">Your Profile</h1>
            
            {message && (
              <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-500/10 border border-red-500 text-red-500' : 'bg-green-500/10 border border-green-500 text-green-500'}`}>
                {message}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium text-primary-text mb-2">Account Information</h3>
              <p className="text-primary-textSecondary">Email: {currentUser?.email}</p>
              <p className="text-primary-textSecondary">User ID: {currentUser?.uid}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Display Name"
                value={profile.displayName || ''}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your display name"
              />
              
              <div>
                <label className="block text-sm font-medium text-primary-textSecondary mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-primary-card border border-primary-border rounded-md text-primary-text placeholder-primary-textSecondary focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-transparent"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell us about yourself"
                />
              </div>
              
              <Input
                label="Website"
                value={profile.website || ''}
                onChange={(e) => setProfile({...profile, website: e.target.value})}
                disabled={!isEditing}
                placeholder="https://example.com"
              />

              <div className="flex space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile(); // Reset changes
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;