import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminNavbar';
import axiosInstance from '../../api/axiosInstance';

const brown = '#8B5A2B';

export default function AdminProfile() {
  const { adminName, adminPhoto, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  
  // View Profile
  const [editName, setEditName] = useState(adminName);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');

  // Change Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Upload Photo
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'A';
  };

  const handleEditName = async (e) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess('');

    if (!editName.trim()) {
      setNameError('Name cannot be empty');
      return;
    }

    try {
      setNameLoading(true);
      updateProfile(editName, null);
      setNameSuccess('Profile name updated successfully');
      setTimeout(() => setNameSuccess(''), 3000);
    } catch (err) {
      setNameError(err.message || 'Failed to update profile');
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      await axiosInstance.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordSuccess('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Image must be smaller than 2MB');
      return;
    }

    try {
      setPhotoLoading(true);
      setPhotoError('');
      setPhotoSuccess('');

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        updateProfile(null, base64String);
        setPhotoSuccess('Photo uploaded successfully');
        setTimeout(() => setPhotoSuccess(''), 3000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setPhotoError('Failed to upload photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const contentComponent = (
    <div className="max-w-4xl">
      {/* Profile Card */}
      <div
        className="bg-white rounded-3xl p-8 mb-8 shadow-sm"
        style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
      >
        <div className="flex items-center space-x-8">
          {adminPhoto ? (
            <img
              src={adminPhoto}
              alt="Admin"
              className="w-28 h-28 rounded-full object-cover border-4"
              style={{ borderColor: brown }}
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white"
              style={{ backgroundColor: brown }}
            >
              {getInitials(adminName || 'A')}
            </div>
          )}

          <div>
            <h2 className="text-3xl font-bold text-gray-900">{adminName || 'Admin'}</h2>
            <p className="text-gray-600 mt-1">Administrator Account</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="bg-white rounded-3xl overflow-hidden shadow-sm"
        style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
      >
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'view'
                ? `text-white`
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{
              backgroundColor: activeTab === 'view' ? brown : 'transparent',
            }}
          >
            View Profile
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'edit'
                ? `text-white`
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{
              backgroundColor: activeTab === 'edit' ? brown : 'transparent',
            }}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'password'
                ? `text-white`
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{
              backgroundColor: activeTab === 'password' ? brown : 'transparent',
            }}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'photo'
                ? `text-white`
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{
              backgroundColor: activeTab === 'photo' ? brown : 'transparent',
            }}
          >
            Upload Photo
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* View Profile */}
          {activeTab === 'view' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <p className="text-lg text-gray-900">{adminName || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <p className="text-lg text-gray-900">Administrator</p>
              </div>
            </div>
          )}

          {/* Edit Profile */}
          {activeTab === 'edit' && (
            <form onSubmit={handleEditName} className="max-w-md">
              {nameError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {nameError}
                </div>
              )}
              {nameSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {nameSuccess}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  required
                  disabled={nameLoading}
                />
              </div>

              <button
                type="submit"
                disabled={nameLoading}
                style={{ backgroundColor: brown }}
                className="w-full px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {nameLoading ? 'Updating...' : 'Update Name'}
              </button>
            </form>
          )}

          {/* Change Password */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="max-w-md">
              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    required
                    disabled={passwordLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    required
                    minLength="8"
                    disabled={passwordLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    required
                    minLength="8"
                    disabled={passwordLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                style={{ backgroundColor: brown }}
                className="mt-6 w-full px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          )}

          {/* Upload Photo */}
          {activeTab === 'photo' && (
            <div className="max-w-md">
              {photoError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {photoError}
                </div>
              )}
              {photoSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {photoSuccess}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Choose Photo
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={photoLoading}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoLoading}
                  style={{ backgroundColor: brown }}
                  className="w-full px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {photoLoading ? 'Uploading...' : 'Select Photo'}
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Accepted formats: JPG, PNG, GIF, WebP (Max 2MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout pageTitle="Profile" pageSubtitle="Manage your account settings">
      {contentComponent}
    </AdminLayout>
  );
}
