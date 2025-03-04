// src/components/Navbar.jsx
import  { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-600 text-white p-4">
      <div className=" container mx-auto flex justify-between items-center">
        <h1 className="bg-gradient-to-r from-orange-600 via-green-500 to-indigo-400 inline-block  p-6 text-transparent bg-clip-text text-4xl font-bold">Attendance Master</h1>
        {user && (
          <button onClick={handleLogout} className="bg-red-500 text-white p-3 rounded">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;