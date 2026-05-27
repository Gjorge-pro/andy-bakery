import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [adminName, setAdminName] = useState('');
  const [adminPhoto, setAdminPhoto] = useState('');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedName = localStorage.getItem('adminName');
    const storedPhoto = localStorage.getItem('adminPhoto');
    
    if (storedToken) {
      setToken(storedToken);
      setAdminName(storedName || '');
      setAdminPhoto(storedPhoto || '');
      setAdmin({ id: 'admin' });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // data should contain token and admin info from API response
    setToken(data.token);
    setAdmin(data.admin || { id: 'admin' });
    
    // Store email as adminName if not provided
    const name = data.adminName || data.admin?.email || '';
    setAdminName(name);
    
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminName', name);
    if (data.adminPhoto) {
      setAdminPhoto(data.adminPhoto);
      localStorage.setItem('adminPhoto', data.adminPhoto);
    }
  };

  const updateProfile = (name, photo) => {
    if (name) {
      setAdminName(name);
      localStorage.setItem('adminName', name);
    }
    if (photo) {
      setAdminPhoto(photo);
      localStorage.setItem('adminPhoto', photo);
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setAdminName('');
    setAdminPhoto('');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminPhoto');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        adminName,
        adminPhoto,
        token,
        login,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
