// src/App.jsx
import 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import TeacherPanel from './components/TeacherPanel';
import StudentPanel from './components/StudentPanel';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student"
                element={
                  <ProtectedRoute role="student">
                    <StudentPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
    </AuthProvider>
  );
};

export default App;