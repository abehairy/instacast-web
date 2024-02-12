// App.js

import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from './ProtectedRoute';
import { Routes, Route } from 'react-router-dom';

import Ask from './pages/Ask';
import AppList from './pages/AppsList';
import AppSetup from './pages/AppSetup';
import NotFoundPage from './pages/NotFoundPage';


import Landing from './pages/Landing';
import Demo from './pages/Demo';

function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Demo />} />

        <Route path="/landing" element={<Landing />} />
        {/* <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} /> */}
        <Route path="/demo" element={<Demo />} />


        <Route path="/ask" element={<ProtectedRoute><Ask /></ProtectedRoute>} />
        <Route path="/apps" element={<ProtectedRoute><AppList /></ProtectedRoute>} />
        <Route path="/apps/:app/:action/:sub" element={<AppSetup />} />
        {/* Catch all other routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
