import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import Toasts from './components/Toasts.jsx';
import StudyBuddyChat from './components/StudyBuddyChat.jsx';
import { Spinner } from './components/ui.jsx';
import Landing from './pages/Landing.jsx';

const Auth = lazy(() => import('./pages/Auth.jsx'));
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Lessons = lazy(() => import('./pages/Lessons.jsx'));
const Learn = lazy(() => import('./pages/Learn.jsx'));
const Quiz = lazy(() => import('./pages/Quiz.jsx'));
const Parent = lazy(() => import('./pages/ParentBridge.jsx'));
const Teacher = lazy(() => import('./pages/Teacher.jsx'));
const Transformer = lazy(() => import('./pages/Transformer.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Growth = lazy(() => import('./pages/GrowthQuest.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function RequireAuth({ children }) {
  const { user, prefs } = useApp();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />;
  if (!prefs.onboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

function RequireUser({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner label="Loading AccessLearn" /></div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/onboarding" element={<RequireUser><Onboarding /></RequireUser>} />
          <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/learn" element={<Navigate to="/learn/photosynthesis" replace />} />
            <Route path="/learn/:lessonId" element={<Learn />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/parent" element={<Parent />} />
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/transformer" element={<Transformer />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/growth" element={<Growth />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toasts />
      <StudyBuddyChat />
    </>
  );
}
