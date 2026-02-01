import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import PageShell from './components/layout/PageShell';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Review from './pages/Review';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminWords from './pages/admin/AdminWords';
import AdminMorphemes from './pages/admin/AdminMorphemes';
import AdminDashboard from './pages/admin/AdminDashboard';
import WordMorphemeEditor from './pages/admin/WordMorphemeEditor';
import AITools from './pages/admin/AITools';
import WordFamilies from './pages/WordFamilies';
import LearnByRoot from './pages/LearnByRoot';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { fetchCurrentUser, isLoading } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="learn" element={<Learn />} />
        <Route path="review" element={<Review />} />
        <Route path="word-families" element={<WordFamilies />} />
        <Route path="learn-by-root" element={<LearnByRoot />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/words"
          element={
            <AdminRoute>
              <AdminWords />
            </AdminRoute>
          }
        />
        <Route
          path="admin/morphemes"
          element={
            <AdminRoute>
              <AdminMorphemes />
            </AdminRoute>
          }
        />
        <Route
          path="admin/word-morphemes"
          element={
            <AdminRoute>
              <WordMorphemeEditor />
            </AdminRoute>
          }
        />
        <Route
          path="admin/ai-tools"
          element={
            <AdminRoute>
              <AITools />
            </AdminRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
