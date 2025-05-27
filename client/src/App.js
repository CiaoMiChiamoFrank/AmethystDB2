import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AccountProvider } from './context/AccountContext';
import { AlertProvider } from './context/AlertContext';  // Importa AlertProvider
import Homepage from './pages/homepage';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Gruppo from './pages/gruppoPage';
import Profile from './pages/UserProfile';
import Alert from './utils/Alert';  // Importa il componente dell'alert

function App() {
  return (
    <AccountProvider>
      <AlertProvider>  {/* Avvolgi con AlertProvider */}
        <Router>
          <Alert />  {/* Aggiungi il componente Alert in alto */}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/header" element={<Header />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gruppo" element={<Gruppo />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </AlertProvider>
    </AccountProvider>
  );
}

export default App;
