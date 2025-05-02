import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  // Redirect if not an admin
  React.useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col w-64 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-r dark:border-gray-700",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">Admin Dashboard</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <X size={20} />
          </Button>
        </div>

        <div className="flex flex-col justify-between flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <Link to="/admin" className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <BarChart className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/users" className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Users className="w-5 h-5 mr-3" />
              <span>Users</span>
            </Link>
            <Link to="/admin/blog" className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <FileText className="w-5 h-5 mr-3" />
              <span>Content</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </Link>
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 mr-3 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <span className="text-xl font-medium">{user.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Site
                </Link>
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "fixed bottom-4 left-4 z-40 md:hidden shadow-md",
          isSidebarOpen ? "hidden" : "block"
        )}
        onClick={toggleSidebar}
      >
        <Menu size={20} />
      </Button>

      {/* Main content */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 