import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { getWebflowAuthUrl } from './services/webflow';
import { Globe, ExternalLink } from 'lucide-react';

const ProtectedLayout = ({ user, setUser, onLogout }) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedPresetSite, setSelectedPresetSite] = useState('site_saas_landing');
  const [customSiteId, setCustomSiteId] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState(null);

  const { connectSite } = useWebflow(user);

  if (!user) return <Navigate to="/login" replace />;

  const handleOpenModal = () => {
    setConnectError(null);
    setIsConnectModalOpen(true);
  };

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    setConnectError(null);

    const targetId = customSiteId.trim() || selectedPresetSite;
    if (!targetId) {
      setConnectError('Please select or enter a Webflow Site ID.');
      return;
    }

    setConnecting(true);
    const success = await connectSite(targetId);
    setConnecting(false);

    if (success) {
      const updatedUser = { ...user, webflowSiteId: targetId };
      setUser(updatedUser);
      localStorage.setItem('flowform_user', JSON.stringify(updatedUser));
      setIsConnectModalOpen(false);
      setCustomSiteId('');
    } else {
      setConnectError('Failed to link Webflow site. Please try again.');
    }
  };

  const handleOAuthConnect = async () => {
    try {
      const res = await getWebflowAuthUrl();
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      setConnectError('Webflow OAuth client is in development mode.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 relative">
      <Sidebar connectedSiteId={user.webflowSiteId} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} onLogout={onLogout} onConnectWebflow={handleOpenModal} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} onOpenConnectModal={handleOpenModal} />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/forms/create" element={<CreateForm />} />
            <Route path="/forms/edit/:id" element={<CreateForm />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Webflow Site Connect Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        title="Connect Webflow Project"
      >
        <form onSubmit={handleConnectSubmit} className="space-y-5">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <Globe className="w-5 h-5 flex-shrink-0 text-indigo-400" />
            <p>
              Link your Webflow Site ID to publish custom form schemas directly to your Webflow project.
            </p>
          </div>

          {connectError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-semibold text-rose-400">
              {connectError}
            </div>
          )}

          {/* Quick Select Webflow Site */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Detected Webflow Project
            </label>
            <select
              value={selectedPresetSite}
              onChange={(e) => {
                setSelectedPresetSite(e.target.value);
                setCustomSiteId('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="site_saas_landing">FlowForm SaaS Landing Page (site_saas_landing)</option>
              <option value="site_design_agency">My Webflow Agency Site (site_design_agency)</option>
              <option value="custom">Custom Webflow Site ID...</option>
            </select>
          </div>

          {/* Custom Site ID Input */}
          {selectedPresetSite === 'custom' && (
            <Input
              label="Custom Webflow Site ID"
              placeholder="e.g. 64aef291bc90aef12345"
              value={customSiteId}
              onChange={(e) => setCustomSiteId(e.target.value)}
              required
            />
          )}

          {/* OAuth Redirect Action */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleOAuthConnect}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Connect via Webflow OAuth
            </button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" type="button" onClick={() => setIsConnectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={connecting}>
                Connect Site
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('flowform_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('flowform_token');
    localStorage.removeItem('flowform_user');
    setUser(null);
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
              setUser={setUser}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
