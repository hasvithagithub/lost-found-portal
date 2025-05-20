import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ReportItemPage from './pages/ReportItemPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/items" 
            element={
              <RequireAuth>
                <ItemsPage />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/items/:id" 
            element={
              <RequireAuth>
                <ItemDetailPage />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/report" 
            element={
              <RequireAuth>
                <ReportItemPage />
              </RequireAuth>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <RequireAuth adminOnly>
                <AdminDashboardPage />
              </RequireAuth>
            } 
          />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <footer className="bg-white shadow-inner py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Lost & Found Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;