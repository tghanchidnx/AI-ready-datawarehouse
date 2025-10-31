
import React, { useState, useRef, useEffect } from 'react';
// FIX: Replaced non-existent UserSwitch icon with Users icon.
import { Bell, Settings, AlertTriangle, Info, CheckCircle, Users, LogOut } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import Modal from '../common/Modal';
import { MOCK_NOTIFICATIONS, MOCK_USERS } from '../../constants';
import type { Notification, View, User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  setCurrentView: (view: View) => void;
}

const NotificationIcon: React.FC<{type: Notification['type']}> = ({type}) => {
    const iconMap = {
        alert: <AlertTriangle className="text-red-400" size={18} />,
        info: <Info className="text-blue-400" size={18} />,
        success: <CheckCircle className="text-green-400" size={18} />,
    };
    return <div className="p-2 bg-brand-primary rounded-full border border-brand-border">{iconMap[type]}</div>
}

const Header: React.FC<HeaderProps> = ({ setCurrentView }) => {
  const { effectiveUser, currentUser, can, startImpersonation, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
      setNotifications(notifications.map(n => n.id === id ? {...n, read: true} : n));
  }
  
  const handleImpersonate = (user: User) => {
    startImpersonation(user);
    setIsImpersonateModalOpen(false);
    setIsUserMenuOpen(false);
  }

  return (
    <>
      <header className="flex-shrink-0 bg-brand-secondary border-b border-brand-border px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-200">AI Data Transformation Platform</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationsRef}>
              <Tooltip text="Notifications">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full text-brand-muted hover:bg-brand-border hover:text-white transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-brand-danger ring-2 ring-brand-secondary"></span>
                  )}
                </button>
              </Tooltip>
              {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-brand-secondary border border-brand-border rounded-md shadow-lg z-20 origin-top-right animate-fade-in-down">
                    <div className="p-3 border-b border-brand-border">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                    </div>
                    <div className="py-1 max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? notifications.map(notif => (
                              <div key={notif.id} onClick={() => handleNotificationClick(notif.id)} className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-brand-border ${!notif.read ? 'bg-brand-accent/10' : ''}`}>
                                  <NotificationIcon type={notif.type} />
                                  <div className="flex-1">
                                      <p className="text-sm text-gray-300">{notif.message}</p>
                                      <p className="text-xs text-brand-muted mt-1">{notif.timestamp}</p>
                                  </div>
                              </div>
                          )) : <p className="text-sm text-brand-muted text-center py-4">No new notifications</p>}
                    </div>
                  </div>
              )}
            </div>
            
             <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                  <img src={effectiveUser.avatarUrl} alt={effectiveUser.name} className="w-10 h-10 rounded-full border-2 border-brand-border"/>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{effectiveUser.name}</p>
                    <p className="text-xs text-brand-muted">{effectiveUser.roleId.replace('role_', '').charAt(0).toUpperCase() + effectiveUser.roleId.slice(6)}</p>
                  </div>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-brand-secondary border border-brand-border rounded-md shadow-lg z-20 py-1 origin-top-right animate-fade-in-down">
                  <div className="px-4 py-3">
                    <p className="text-sm text-white font-semibold">Signed in as</p>
                    <p className="text-sm text-brand-muted truncate">{currentUser.email}</p>
                  </div>
                   <div className="border-t border-brand-border my-1"></div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-border transition-colors">Profile</a>
                  {can('view_settings') && (
                    <button onClick={() => { setCurrentView('settings'); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-brand-border transition-colors">
                      <Settings size={16} /> All Settings
                    </button>
                  )}
                  {can('impersonate_users') && (
                     <button onClick={() => setIsImpersonateModalOpen(true)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-brand-border transition-colors">
                      <Users size={16} /> Impersonate User
                    </button>
                  )}
                  <div className="border-t border-brand-border my-1"></div>
                  <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-brand-border transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <Modal isOpen={isImpersonateModalOpen} onClose={() => setIsImpersonateModalOpen(false)} title="Impersonate User">
        <div className="space-y-3">
            <p className="text-sm text-brand-muted">Select a user to view the application from their perspective. Your original permissions will be restored when you stop impersonating.</p>
            <ul className="space-y-2 max-h-80 overflow-y-auto">
                {MOCK_USERS.filter(u => u.id !== currentUser.id).map(user => (
                    <li key={user.id}>
                        <button onClick={() => handleImpersonate(user)} className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-brand-border transition-colors">
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                            <div className="text-left">
                                <p className="font-semibold text-white">{user.name}</p>
                                <p className="text-sm text-brand-muted">{user.email}</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      </Modal>
    </>
  );
};

export default Header;
