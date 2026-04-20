import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TestIntro from './pages/TestIntro';
import Questions from './pages/Questions';
import Submit from './pages/Submit';
import Login from './pages/Login';
import Result from './pages/Result';
import CareerGuide from './pages/CareerGuide';
import ShareSave from './pages/ShareSave';
import QuickAssessment from './pages/QuickAssessment';
import History from './pages/History';
import About from './pages/About';
import TypesOverview from './pages/TypesOverview';
import TypeDetail from './pages/TypeDetail';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import LoginModal from './components/LoginModal';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('react_auth_user');
    if (storedUser) {
      try { return JSON.parse(storedUser); } 
      catch { return null; }
    }
    return null;
  });

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
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />} />
        
        {/* System Shell */}
        <Route element={<Layout user={user} onLogout={handleLogout} onOpenLoginModal={toggleLoginModal} />}>
          {/* Public Content Routes */}
          <Route path="/" element={<Home user={user} onOpenLoginModal={toggleLoginModal} />} />
          <Route path="/about" element={<About user={user} onOpenLoginModal={toggleLoginModal} />} />
          <Route path="/types" element={<TypesOverview user={user} onOpenLoginModal={toggleLoginModal} />} />
          <Route path="/types/:typeId" element={<TypeDetail user={user} onOpenLoginModal={toggleLoginModal} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          
          {/* Protected Area */}
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/test-intro" element={user ? <TestIntro user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/questions" element={user ? <Questions user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/submit" element={user ? <Submit user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/result" element={user ? <Result user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/career-guide" element={user ? <CareerGuide user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/share-save" element={user ? <ShareSave user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/quick-assessment" element={user ? <QuickAssessment user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/pricing" element={<Pricing user={user} />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </Router>
  );
}

export default App;
