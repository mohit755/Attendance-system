// context/AuthContext.js
import { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (data) => {
    if (!data.token) {
      throw new Error('No token received');
    }
    setToken(data.token);
    // Handle both { user: { username, role } } and { role } structures
    const userData = data.user || { username: data.username || 'unknown', role: data.role };
    if (!userData.role) {
      throw new Error('Role not provided in login response');
    }
    setUser(userData);
    return userData.role;
  };

  const register = async (data) => {
    if (!data.token) {
      throw new Error('No token received');
    }
    setToken(data.token);
    const userData = data.user || { username: data.username || 'unknown', role: data.role };
    if (!userData.role) {
      throw new Error('Role not provided in register response');
    }
    setUser(userData);
    return userData.role;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;