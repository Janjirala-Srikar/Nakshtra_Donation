import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './components/Signup'
import Signin from './components/Signin'
import Dashboard from './components/Dashboard'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './components/LandingPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/signin" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App