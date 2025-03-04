// Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { loginUser, registerUser } from './requests';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const credentials = isRegister
      ? { username, password, role, ...(role === 'student' && { enrollmentNo }), ...(role === 'teacher' && { teacherName }) }
      : { username, password };
  
    console.log('Sending from Login.jsx:', credentials);
  
    try {
      const data = await (isRegister ? registerUser(credentials) : loginUser(credentials));
      console.log(`${isRegister ? 'Register' : 'Login'} successful:`, data);
  
      if (isRegister) {
        await register(data);
        navigate('/');
      } else {
        await login(data);
        navigate(role === 'teacher' ? '/teacher' : '/student');
      }
    } catch (error) {
      const errorMessage = error.msg || (error.response && error.response.data.msg) || error.message || 'Failed to login';
      console.error(`${isRegister ? 'Register' : 'Login'} error:`, errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.02]">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-6 bg-red-100/50 p-3 rounded-lg animate-pulse">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          {isRegister && (
            <>
              {role === 'student' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Enrollment No.</label>
                  <input
                    type="text"
                    value={enrollmentNo}
                    onChange={(e) => setEnrollmentNo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              )}
              {role === 'teacher' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              )}
            </>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
          <button className="block text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;