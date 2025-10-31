
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { MOCK_NOTIFICATIONS } from '../../constants';
import type { Notification, View } from '../../types';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
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

  return (
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
          
          <div className="relative" ref={settingsRef}>
            <Tooltip text="Settings">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-full text-brand-muted hover:bg-brand-border hover:text-white transition-colors"
                aria-haspopup="true"
                aria-expanded={isSettingsOpen}
              >
                <Settings size={20} />
              </button>
            </Tooltip>
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-brand-secondary border border-brand-border rounded-md shadow-lg z-20 py-1 origin-top-right animate-fade-in-down">
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-border transition-colors">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-border transition-colors">Billing</a>
                <div className="border-t border-brand-border my-1"></div>
                <button onClick={() => { setCurrentView('settings'); setIsSettingsOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-brand-border transition-colors">All Settings</button>
                <div className="border-t border-brand-border my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-border transition-colors">Logout</a>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold">
              DA
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">Data Analyst</p>
              <p className="text-xs text-brand-muted">Enterprise</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
