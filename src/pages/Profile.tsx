import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/ui/Loader';
import { backendApi } from '../services/backend';
import { UserProfileResponse } from '../types/backend';

type Banner = { type: 'success' | 'error'; text: string } | null;

const Profile: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const email = currentUser?.email ?? '';
  const [profiles, setProfiles] = useState<UserProfileResponse[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [feedback, setFeedback] = useState<Banner>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleError = (error: unknown, fallback: string) => {
    console.error(fallback, error);
    setFeedback({
      type: 'error',
      text: error instanceof Error ? error.message : fallback,
    });
  };

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const fetchProfiles = useCallback(async () => {
    if (!email) {
      setIsFetching(false);
      return;
    }
    setIsFetching(true);
    try {
      const data = await backendApi.getUserProfiles();
      setProfiles(data);
      const match = data.find((profile) => profile.email.toLowerCase() === email.toLowerCase()) || null;
      setUserProfile(match);
      if (match) {
        setDisplayName(match.displayName);
      } else if (email) {
        setDisplayName(email.split('@')[0] ?? '');
      }
    } catch (error) {
      handleError(error, 'Unable to load profiles from the backend.');
    } finally {
      setIsFetching(false);
    }
  }, [email]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      return;
    }
    setIsSaving(true);
    try {
      if (userProfile) {
        await backendApi.deleteUserProfile(userProfile.id);
      }
      const created = await backendApi.createUserProfile({
        email,
        displayName: displayName.trim() || email,
      });
      setUserProfile(created);
      setProfiles((prev) => {
        const remaining = prev.filter((profile) => profile.id !== userProfile?.id);
        return [created, ...remaining];
      });
      setFeedback({ type: 'success', text: 'Profile saved in the backend service.' });
    } catch (error) {
      handleError(error, 'Failed to persist your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async (id: number) => {
    setIsDeleting(id);
    try {
      await backendApi.deleteUserProfile(id);
      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
      if (userProfile?.id === id) {
        setUserProfile(null);
        setDisplayName(email ? email.split('@')[0] ?? '' : '');
      }
      setFeedback({ type: 'success', text: 'Profile entry removed.' });
    } catch (error) {
      handleError(error, 'Unable to delete that profile.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-gray-500">Profile & identity</p>
          <h1 className="text-3xl font-bold text-white mt-1">Your AnyPost identity</h1>
          <p className="text-gray-400 mt-2">
            Sync your Firebase account with the Spring backend so assets, drafts, and jobs can reference a profile ID.
          </p>
        </header>

        {feedback && (
          <div
            className={`glass px-4 py-3 rounded-lg border ${
              feedback.type === 'error' ? 'border-red-500/40 text-red-300' : 'border-green-500/40 text-green-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="glass border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Account</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-500">Email:</span> {currentUser?.email}
              </p>
              <p>
                <span className="text-gray-500">Firebase UID:</span> {currentUser?.uid}
              </p>
              <p>
                <span className="text-gray-500">Backend profile:</span>{' '}
                {userProfile ? (
                  <span className="text-green-400">#{userProfile.id}</span>
                ) : (
                  <span className="text-red-400">Not created</span>
                )}
              </p>
              {userProfile?.createdAt && (
                <p className="text-gray-500 text-xs">
                  Created {new Date(userProfile.createdAt).toLocaleString()}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={fetchProfiles} isLoading={isFetching}>
              Reload profiles
            </Button>
          </section>

          <section className="glass border border-gray-800 rounded-2xl p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Backend profile</h2>
                <p className="text-sm text-gray-400">
                  The Spring API stores this record and connects it to assets, drafts, and jobs.
                </p>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <Input
                label="Display name"
                placeholder="Product Marketing"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <div className="flex items-center space-x-3">
                <Button type="submit" variant="primary" isLoading={isSaving}>
                  {userProfile ? 'Update profile' : 'Create profile'}
                </Button>
                {userProfile && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleDeleteProfile(userProfile.id)}
                    isLoading={isDeleting === userProfile.id}
                  >
                    Remove my profile
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Saving overwrites your existing backend profile so downstream resources always point to the latest display
                name.
              </p>
            </form>
          </section>
        </div>

        <section className="glass border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Collaborator directory</h2>
              <p className="text-sm text-gray-400">Every publication job can reference these profile IDs as owners.</p>
            </div>
            <span className="text-sm text-gray-500">{profiles.length} profiles</span>
          </div>

          <div className="overflow-x-auto border border-gray-800 rounded-xl">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
              <thead className="bg-gray-900/40 text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Display name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-white">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-gray-400">#{profile.id}</td>
                    <td className="px-4 py-3">{profile.displayName}</td>
                    <td className="px-4 py-3 text-gray-300">{profile.email}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleDeleteProfile(profile.id)}
                        disabled={isDeleting !== null}
                        isLoading={isDeleting === profile.id}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {!profiles.length && (
                  <tr>
                    <td className="px-4 py-4 text-center text-gray-500" colSpan={5}>
                      {isFetching ? 'Loading profiles...' : 'No profiles registered yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Profile;
