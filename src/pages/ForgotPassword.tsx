import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Layout from '../components/Layout';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await resetPassword(email);
      setMessage('Check your email for the password reset link');
    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-primary-card p-8 rounded-lg border border-primary-border">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-text">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-primary-textSecondary">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded">
                {message}
              </div>
            )}
            <div>
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full"
              >
                Send reset link
              </Button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-primary-accent hover:text-blue-500"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;