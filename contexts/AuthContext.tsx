import React, { createContext, useContext, useState, useMemo } from 'react';
import type { User, Role, PermissionId } from '../types';
import { MOCK_USERS, MOCK_ROLES } from '../constants';

interface AuthContextType {
  currentUser: User;
  impersonatedUser: User | null;
  effectiveUser: User;
  permissions: Set<PermissionId>;
  isImpersonating: boolean;
  can: (permission: PermissionId) => boolean;
  startImpersonation: (user: User) => void;
  stopImpersonation: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, this would be determined by a session, etc.
  // We default to the Admin user for demo purposes.
  const [currentUser] = useState<User>(MOCK_USERS.find(u => u.roleId === 'role_admin')!);
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);

  const effectiveUser = impersonatedUser || currentUser;

  const permissions = useMemo(() => {
    const userRole = MOCK_ROLES.find(role => role.id === effectiveUser.roleId);
    return new Set<PermissionId>(userRole?.permissions || []);
  }, [effectiveUser]);

  const can = (permission: PermissionId) => {
    return permissions.has(permission);
  };

  const startImpersonation = (user: User) => {
    if (currentUser.roleId === 'role_admin') {
      setImpersonatedUser(user);
    } else {
      console.error("Only admins can impersonate users.");
    }
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
  };

  const logout = () => {
    // In a real app, this would clear the session/token and redirect to a login page.
    alert("User logged out. In a real application, you would be redirected to the login page.");
  };

  const value = {
    currentUser,
    impersonatedUser,
    effectiveUser,
    permissions,
    isImpersonating: !!impersonatedUser,
    can,
    startImpersonation,
    stopImpersonation,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
