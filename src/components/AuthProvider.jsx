"use client";


import React, { createContext, useState, useEffect, useContext } from 'react';
import LoginModal from './LoginModal';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('react_auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    const loggedInUser = userData?.student || userData?.user;
    
    if (loggedInUser) {
      const formattedUser = {
        ...loggedInUser,
        name: loggedInUser.FullName || loggedInUser.fullName || loggedInUser.name,
        _id: loggedInUser._id || loggedInUser.id,
        initials: (loggedInUser.FullName || loggedInUser.name)?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        enrolledCourses: userData?.enrolledCourses || []
      };
      localStorage.setItem('react_auth_user', JSON.stringify(formattedUser));
      setUser(formattedUser);
    } else {
      const fallbackUser = { name: 'Student Admin', _id: 'demo-user-id', initials: 'SA' };
      localStorage.setItem('react_auth_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('react_auth_user');
  };

  const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen);

  return (
    <AuthContext.Provider value={{ user, handleLogout, toggleLoginModal, handleLoginSuccess }}>
      {children}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </AuthContext.Provider>
  );
}
