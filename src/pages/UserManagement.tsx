import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllUsers, updateUserRole, UserData, formatDate } from '@/utils/api';
import { toast } from 'sonner';
import { UserCog, Shield, Users } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (user?.role !== 'ADMIN') {
      navigate('/', { replace: true });
      toast.error('You do not have permission to access this page');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'DEFAULT' | 'MANAGER') => {
    try {
      const updatedUser = await updateUserRole(userId, newRole);
      if (updatedUser) {
        // Update the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4 text-amber-600" />;
      case 'MANAGER':
        return <UserCog className="h-4 w-4 text-blue-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage user accounts and roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {users.length === 0 
              ? "No users found." 
              : `${users.length} user${users.length !== 1 ? 's' : ''} in the system.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((userData) => (
                <React.Fragment key={userData.id}>
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{userData.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {userData.email}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Joined {formatDate(userData.createdAt)}
                        </span>
                        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-muted rounded-full">
                          {getRoleIcon(userData.role)}
                          <span>{userData.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="self-end md:self-center">
                      <Select
                        defaultValue={userData.role}
                        onValueChange={(value) => handleRoleChange(
                          userData.id, 
                          value as 'ADMIN' | 'DEFAULT' | 'MANAGER'
                        )}
                        disabled={userData.id === user?.id} // Can't change own role
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="MANAGER">MANAGER</SelectItem>
                          <SelectItem value="DEFAULT">DEFAULT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement; 