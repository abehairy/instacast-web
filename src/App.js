// App.js

import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from './ProtectedRoute';
import { Routes, Route } from 'react-router-dom';

import Ask from './pages/Ask';
import AppList from './pages/AppsList';
import AppSetup from './pages/AppSetup';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import LifeGraphList from './pages/LifeGraphList';
import LifeGraphViewer from './pages/LifeGraphViewer';
import PatientJourney from './pages/PatientJourney';

import NodeDetails from './pages/NodeDetails';

import Journal from './pages/Journal';
import LifeGraphTimeline from './pages/LifeGraphTimeline';
import LifeGraphFlow from './pages/LifeGraphFlow';

import Landing from './pages/Landing';
import Demo from './pages/Demo';

function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<PatientJourney />} />

        <Route path="/landing" element={<Landing />} />
        {/* <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} /> */}
        <Route path="/demo" element={<Demo />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/ask" element={<ProtectedRoute><Ask /></ProtectedRoute>} />
        <Route path="/lifegraph/list" element={<ProtectedRoute><LifeGraphList /></ProtectedRoute>} />
        <Route path="/lifegraph/viewer" element={<ProtectedRoute><LifeGraphViewer /></ProtectedRoute>} />
        <Route path="/lifegraph/timeline" element={<ProtectedRoute><LifeGraphTimeline /></ProtectedRoute>} />
        <Route path="/lifegraph/flow" element={<ProtectedRoute><LifeGraphFlow /></ProtectedRoute>} />

        <Route path="/lifegraph/:node" element={<ProtectedRoute><NodeDetails /></ProtectedRoute>} />
        <Route path="/apps" element={<ProtectedRoute><AppList /></ProtectedRoute>} />
        <Route path="/apps/:app/:action/:sub" element={<AppSetup />} />
        {/* Catch all other routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
