import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Dashboard/Sidebar';
import Navbar from './components/Dashboard/Navbar';
import Modal from './components/UI/Modal';
import Input from './components/UI/Input';
import Button from './components/UI/Button';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Forms from './pages/Forms';
import CreateForm from './pages/CreateForm';
import Submissions from './pages/Submissions';
import { useWebflow } from './hooks/useWebflow';
import { Globe, CheckCircle2 } from 'lucide-react';

const ProtectedLayout = ({ user, onLogout, onOpenConnectModal }) => {
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar connectedSiteId={user.webflowSiteId} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} onLogout={onLogout} onOpenConnectModal={onOpenConnectModal} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} onOpenConnectModal={onOpenConnectModal} />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/forms/create" element={<CreateForm />} />
            <Route path="/forms/edit/:id" element={<CreateForm />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('flowform_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [inputSiteId, setInputSiteId] = useState('');
  const [connecting, setConnecting] = useState(false);

  const { connectSite } = useWebflow(user);

  const handleLogout = () => {
    localStorage.removeItem('flowform_token');
    localStorage.removeItem('flowform_user');
    setUser(null);
  };

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    if (!inputSiteId) return;

    setConnecting(true);
    const success = await connectSite(inputSiteId);
    setConnecting(false);

    if (success) {
      const updatedUser = { ...user, webflowSiteId: inputSiteId };
      setUser(updatedUser);
      localStorage.setItem('flowform_user', JSON.stringify(updatedUser));
      setIsConnectModalOpen(false);
      setInputSiteId('');
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={(u) => setUser(u)} />
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedLayout
              user={user}
              onLogout={handleLogout}
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
            />
          }
        />
      </Routes>

      {/* Webflow Site Connect Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        title="Connect Webflow Site"
      >
        <form onSubmit={handleConnectSubmit} className="space-y-5">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <Globe className="w-5 h-5 flex-shrink-0" />
            <p>
              Link your Webflow Site ID (found in Webflow Dashboard Site Settings) to connect forms directly.
            </p>
          </div>

          <Input
            label="Webflow Site ID"
            placeholder="e.g. 64aef291bc90aef12345"
            value={inputSiteId}
            onChange={(e) => setInputSiteId(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsConnectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={connecting}>
              Connect Webflow Site
            </Button>
          </div>
        </form>
      </Modal>
    </BrowserRouter>
  );
}
