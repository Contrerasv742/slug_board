import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import EditText from '../components/ui/EditText';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updatePassword(password);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => navigate('/home'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-global-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-global-3 rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

          {success ? (
              <div className="text-center py-8">
                <p className="text-green-500 mb-4">Password updated successfully!</p>
                <p>Redirecting to home page...</p>
              </div>
          ) : (
              <form onSubmit={handleSubmit}>
                <EditText
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4"
                    required
                />

                <EditText
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mb-6"
                    required
                />

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </Button>
              </form>
          )}
        </div>
      </div>
  );
};

export default ResetPasswordPage;