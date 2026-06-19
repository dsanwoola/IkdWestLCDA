import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/lib/auth';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Edit,
  Menu,
  X,
  ClipboardList,
  FolderOpen,
  BarChart3,
  Calendar,
  MessageSquare,
  Shield,
  Building2,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { Input } from '@/react-app/components/ui/input';

interface StaffProfile {
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
}

interface ExtendedUser {
  id: string;
  email: string;
  google_user_data: {
    name?: string | null;
    picture?: string | null;
  };
  staffProfile: StaffProfile | null;
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  chairman: 'Chairman',
  lcda_secretary: 'LCDA Secretary',
  hod: 'Head of Department',
  department_staff: 'Department Staff',
  digital_champion: 'Digital Champion',
  citizen: 'Citizen'
};

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/staff', active: true },
  { icon: Building2, label: 'My Department', href: '/staff/department' },
  { icon: Edit, label: 'Content Manager', href: '/staff/cms' },
  { icon: Heart, label: 'Marriage Applications', href: '/staff/marriage-applications' },
  { icon: ClipboardList, label: 'Service Requests', href: '/staff/service-requests' },
  { icon: FolderOpen, label: 'Projects', href: '/staff/projects' },
  { icon: FileText, label: 'Documents', href: '/staff/documents' },
  { icon: Users, label: 'Staff Directory', href: '/staff/directory' },
  { icon: BarChart3, label: 'Reports', href: '/staff/reports' },
  { icon: Calendar, label: 'Calendar', href: '/staff/calendar' },
  { icon: MessageSquare, label: 'Messages', href: '/staff/messages', badge: '3' },
];

const adminItems = [
  { icon: Shield, label: 'User Management', href: '/staff/users' },
  { icon: Building2, label: 'Departments', href: '/staff/departments' },
  { icon: Settings, label: 'Settings', href: '/staff/settings' },
];

export default function StaffDashboardPage() {
  const navigate = useNavigate();
  const { user, isPending, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/staff/login');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    const fetchExtendedUser = async () => {
      try {
        const res = await fetch('/api/users/me');
        if (res.ok) {
          const data = await res.json();
          setExtendedUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    if (user) {
      fetchExtendedUser();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/staff/login');
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const res = await fetch('/api/staff/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: user?.google_user_data?.name || ''
        })
      });
      
      if (res.ok) {
        // Refresh user data
        const userRes = await fetch('/api/users/me');
        if (userRes.ok) {
          const data = await userRes.json();
          setExtendedUser(data);
        }
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
    setIsRegistering(false);
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Show registration prompt if no staff profile
  if (extendedUser && !extendedUser.staffProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Complete Your Registration</h1>
            <p className="text-muted-foreground mb-6">
              Welcome! Please complete your staff registration to access the portal.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={user.google_user_data?.picture || ''} 
                  alt="" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium">{user.google_user_data?.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleRegister} 
              className="w-full gap-2"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full mt-3"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const staffProfile = extendedUser?.staffProfile;
  const isAdmin = staffProfile && ['super_admin', 'chairman', 'lcda_secretary'].includes(staffProfile.role);

  if (staffProfile?.role === 'citizen') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Awaiting Staff Approval</h1>
            <p className="text-muted-foreground mb-6">
              Your account has been registered, but a portal administrator must assign a staff role before you can access staff tools.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <img
                  src={user.google_user_data?.picture || ''}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium">{staffProfile.full_name || user.google_user_data?.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[82vw] max-w-72 transform border-r bg-white transition-transform duration-200 ease-in-out sm:w-72
        lg:w-64 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col safe-bottom">
          {/* Logo */}
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Main Menu
            </div>
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`
                  flex min-h-11 items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${item.active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </span>
                {item.badge && (
                  <Badge className={item.active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-3 px-3">
                  Administration
                </div>
                {adminItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex min-h-11 items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={user.google_user_data?.picture || ''} 
                alt="" 
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {staffProfile?.full_name || user.google_user_data?.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {staffProfile ? roleLabels[staffProfile.role] : 'Staff'}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 border-b bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="-ml-2 min-h-11 min-w-11 rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 w-64 bg-gray-50 border-0 focus-visible:bg-white focus-visible:ring-2"
                />
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button className="relative min-h-11 min-w-11 rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link to="/" className="hidden text-sm text-muted-foreground transition-colors hover:text-primary min-[420px]:inline">
                View Public Site
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-4 pb-8 lg:p-6">
          {/* Welcome */}
          <div className="mb-6">
            <h1 className="text-balance text-xl font-bold sm:text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome back, {staffProfile?.full_name?.split(' ')[0] || user.google_user_data?.given_name || 'Staff'}!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Here's what's happening in Ikorodu West LCDA today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Requests</p>
                    <p className="text-2xl font-bold mt-1">24</p>
                    <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      8 urgent
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved This Week</p>
                    <p className="text-2xl font-bold mt-1">156</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +12% from last week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold mt-1">18</p>
                    <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                      <Building2 className="w-3 h-3" />
                      3 near completion
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Staff Online</p>
                    <p className="text-2xl font-bold mt-1">42</p>
                    <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      8 departments active
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Requests */}
            <Card className="border-0 shadow-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">Recent Service Requests</CardTitle>
                  <Link to="/staff/requests" className="text-sm text-primary hover:underline">
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'SR-2024-001', type: 'Road Repair', citizen: 'Adebayo Johnson', status: 'pending', priority: 'high' },
                    { id: 'SR-2024-002', type: 'Street Light', citizen: 'Funke Akindele', status: 'in_progress', priority: 'medium' },
                    { id: 'SR-2024-003', type: 'Drainage Issue', citizen: 'Chukwu Emmanuel', status: 'pending', priority: 'high' },
                    { id: 'SR-2024-004', type: 'Birth Certificate', citizen: 'Ngozi Okafor', status: 'completed', priority: 'normal' },
                    { id: 'SR-2024-005', type: 'Market Stall', citizen: 'Ibrahim Musa', status: 'in_progress', priority: 'medium' },
                  ].map((request) => (
                    <div 
                      key={request.id}
                      className="grid gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 sm:flex sm:cursor-pointer sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <div className={`
                          w-2 h-8 rounded-full
                          ${request.priority === 'high' ? 'bg-red-500' : request.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'}
                        `} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{request.type}</div>
                          <div className="truncate text-xs text-muted-foreground">{request.id} • {request.citizen}</div>
                        </div>
                      </div>
                      <Badge className={
                        request.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : request.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }>
                        {request.status === 'in_progress' ? 'In Progress' : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-auto py-3"
                    onClick={() => navigate('/staff/service-requests?action=new')}
                  >
                    <ClipboardList className="w-5 h-5 text-primary" />
                    <span className="text-left">
                      <span className="block font-medium">New Service Request</span>
                      <span className="block text-xs text-muted-foreground">Create citizen request</span>
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-auto py-3"
                    onClick={() => navigate('/staff/reports')}
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-left">
                      <span className="block font-medium">Generate Report</span>
                      <span className="block text-xs text-muted-foreground">Weekly/monthly reports</span>
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-auto py-3"
                    onClick={() => navigate('/staff/calendar')}
                  >
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-left">
                      <span className="block font-medium">Schedule Meeting</span>
                      <span className="block text-xs text-muted-foreground">Book department meetings</span>
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-auto py-3"
                    onClick={() => navigate('/staff/cms/announcements/new')}
                  >
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span className="text-left">
                      <span className="block font-medium">Send Announcement</span>
                      <span className="block text-xs text-muted-foreground">Notify staff members</span>
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Announcements */}
          <Card className="mt-6 border-0 shadow-sm border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">System Announcement</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monthly staff meeting scheduled for Friday, January 10th at 10:00 AM. All department heads are required to submit their reports by Thursday.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
