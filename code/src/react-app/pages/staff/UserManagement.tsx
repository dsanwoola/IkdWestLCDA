import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/lib/auth';
import { 
  LayoutDashboard, 
  Users, 
  Shield,
  LogOut, 
  Menu,
  X,
  Search,
  Loader2,
  ChevronLeft,
  MoreVertical,
  UserCog,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { Input } from '@/react-app/components/ui/input';

interface StaffUser {
  id: number;
  mocha_user_id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  department_id: number | null;
  job_title: string;
  profile_photo: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
}

interface ExtendedUser {
  id: string;
  staffProfile: {
    id: number;
    role: string;
    full_name: string;
  } | null;
  google_user_data: {
    picture?: string | null;
  };
}

const roles = [
  { value: 'super_admin', label: 'Super Admin', color: 'bg-red-100 text-red-700' },
  { value: 'chairman', label: 'Chairman', color: 'bg-purple-100 text-purple-700' },
  { value: 'lcda_secretary', label: 'LCDA Secretary', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'hod', label: 'Head of Department', color: 'bg-blue-100 text-blue-700' },
  { value: 'department_staff', label: 'Department Staff', color: 'bg-green-100 text-green-700' },
  { value: 'digital_champion', label: 'Digital Champion', color: 'bg-amber-100 text-amber-700' },
  { value: 'citizen', label: 'Citizen', color: 'bg-gray-100 text-gray-700' },
];

export default function UserManagementPage() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    role: '',
    department_id: '',
    job_title: ''
  });

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/staff/login');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, staffRes, deptRes] = await Promise.all([
          fetch('/api/users/me'),
          fetch('/api/staff'),
          fetch('/api/departments')
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setExtendedUser(userData);
          
          // Check if user is super admin
          if (userData.staffProfile?.role !== 'super_admin') {
            navigate('/staff');
            return;
          }
        }

        if (staffRes.ok) {
          const staffData = await staffRes.json();
          setStaffUsers(staffData);
        }

        if (deptRes.ok) {
          const deptData = await deptRes.json();
          setDepartments(deptData);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user, navigate]);

  const handleSelectUser = (staffUser: StaffUser) => {
    setSelectedUser(staffUser);
    setEditForm({
      role: staffUser.role,
      department_id: staffUser.department_id?.toString() || '',
      job_title: staffUser.job_title || ''
    });
    setEditMode(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: editForm.role,
          department_id: editForm.department_id ? parseInt(editForm.department_id) : null,
          job_title: editForm.job_title
        })
      });

      if (res.ok) {
        // Refresh staff list
        const staffRes = await fetch('/api/staff');
        if (staffRes.ok) {
          const staffData = await staffRes.json();
          setStaffUsers(staffData);
          
          // Update selected user
          const updatedUser = staffData.find((u: StaffUser) => u.id === selectedUser.id);
          if (updatedUser) {
            setSelectedUser(updatedUser);
          }
        }
        setEditMode(false);
      }
    } catch (err) {
      console.error('Failed to save changes:', err);
    }
    setSaving(false);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig || { label: role, color: 'bg-gray-100 text-gray-700' };
  };

  const getDepartmentName = (deptId: number | null) => {
    if (!deptId) return 'Not Assigned';
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || 'Unknown';
  };

  const filteredUsers = staffUsers.filter(staff => {
    const matchesSearch = staff.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.job_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || !extendedUser?.staffProfile || extendedUser.staffProfile.role !== 'super_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simplified Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link to="/staff" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">IW</span>
              </div>
              <div>
                <div className="font-bold text-sm">Ikorodu West</div>
                <div className="text-xs text-muted-foreground">Staff Portal</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link
              to="/staff"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/staff/users"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-white"
            >
              <Users className="w-5 h-5" />
              User Management
            </Link>
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={user.google_user_data?.picture || ''} 
                alt="" 
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {extendedUser.staffProfile?.full_name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  Super Admin
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={() => navigate('/staff')}
            >
              <LogOut className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white border-b px-4 lg:px-6 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/staff" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <h1 className="text-lg font-semibold">User Management</h1>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{staffUsers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Admins</p>
                    <p className="text-2xl font-bold">
                      {staffUsers.filter(u => ['super_admin', 'chairman', 'lcda_secretary'].includes(u.role)).length}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-red-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Staff</p>
                    <p className="text-2xl font-bold">
                      {staffUsers.filter(u => ['hod', 'department_staff', 'digital_champion'].includes(u.role)).length}
                    </p>
                  </div>
                  <UserCog className="w-8 h-8 text-blue-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">
                      {staffUsers.filter(u => u.is_active).length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* User List */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <CardTitle className="text-lg">Staff Users</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search users..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm bg-white"
                      >
                        <option value="">All Roles</option>
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No users found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredUsers.map((staff) => {
                        const roleBadge = getRoleBadge(staff.role);
                        return (
                          <div
                            key={staff.id}
                            onClick={() => handleSelectUser(staff)}
                            className={`
                              flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                              ${selectedUser?.id === staff.id ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50 hover:bg-gray-100'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold text-sm">
                                  {staff.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-sm flex items-center gap-2">
                                  {staff.full_name || 'Unnamed User'}
                                  {staff.is_active ? (
                                    <span className="w-2 h-2 bg-green-500 rounded-full" title="Active" />
                                  ) : (
                                    <span className="w-2 h-2 bg-gray-300 rounded-full" title="Inactive" />
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">{staff.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={roleBadge.color}>{roleBadge.label}</Badge>
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* User Details Panel */}
            <div>
              <Card className="border-0 shadow-sm sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">User Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedUser ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <UserCog className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Select a user to view details</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Profile Header */}
                      <div className="text-center pb-4 border-b">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-primary font-bold text-2xl">
                            {selectedUser.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">{selectedUser.full_name || 'Unnamed User'}</h3>
                        <p className="text-sm text-muted-foreground">{selectedUser.job_title || 'No title'}</p>
                        <div className="mt-2">
                          <Badge className={getRoleBadge(selectedUser.role).color}>
                            {getRoleBadge(selectedUser.role).label}
                          </Badge>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedUser.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span>{getDepartmentName(selectedUser.department_id)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Joined {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          {selectedUser.is_active ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Inactive</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Edit Form */}
                      {editMode ? (
                        <div className="pt-4 border-t space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1.5">Role</label>
                            <select
                              value={editForm.role}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                              className="w-full border rounded-md px-3 py-2 text-sm"
                            >
                              {roles.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1.5">Department</label>
                            <select
                              value={editForm.department_id}
                              onChange={(e) => setEditForm({ ...editForm, department_id: e.target.value })}
                              className="w-full border rounded-md px-3 py-2 text-sm"
                            >
                              <option value="">Not Assigned</option>
                              {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1.5">Job Title</label>
                            <Input
                              value={editForm.job_title}
                              onChange={(e) => setEditForm({ ...editForm, job_title: e.target.value })}
                              placeholder="Enter job title"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleSaveChanges}
                              className="flex-1"
                              disabled={saving}
                            >
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => setEditMode(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-4 border-t">
                          <Button 
                            className="w-full gap-2"
                            onClick={() => setEditMode(true)}
                          >
                            <UserCog className="w-4 h-4" />
                            Edit Role & Department
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
