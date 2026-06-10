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
  AlertCircle,
  GraduationCap,
  HandHeart,
  Wallet,
  UserCog,
  HardHat,
  Stethoscope,
  BookOpen,
  Tractor,
  Recycle,
  ChevronRight,
  ArrowUpRight,
  CircleDot
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

interface DepartmentConfig {
  name: string;
  shortName: string;
  icon: typeof Building2;
  color: string;
  bgColor: string;
  stats: { label: string; value: string; trend?: string; trendUp?: boolean }[];
  tasks: { id: string; title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }[];
  quickActions: { label: string; description: string; icon: typeof FileText }[];
  kpis: { label: string; current: number; target: number; unit: string }[];
}

const departmentConfigs: Record<number, DepartmentConfig> = {
  1: { // Administration & HR
    name: 'Administration & Human Resources',
    shortName: 'Admin & HR',
    icon: UserCog,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    stats: [
      { label: 'Total Staff', value: '156', trend: '+3 this month', trendUp: true },
      { label: 'Leave Requests', value: '12', trend: '5 pending approval' },
      { label: 'Open Positions', value: '4', trend: '2 interviews scheduled' },
      { label: 'Training Sessions', value: '3', trend: 'This week' },
    ],
    tasks: [
      { id: 'HR-001', title: 'Review staff promotion recommendations', priority: 'high', dueDate: 'Today' },
      { id: 'HR-002', title: 'Process leave applications (5 pending)', priority: 'medium', dueDate: 'Tomorrow' },
      { id: 'HR-003', title: 'Update employee records for Q1', priority: 'low', dueDate: 'Jan 15' },
      { id: 'HR-004', title: 'Prepare monthly attendance report', priority: 'medium', dueDate: 'Jan 10' },
    ],
    quickActions: [
      { label: 'New Staff Registration', description: 'Onboard new employee', icon: Users },
      { label: 'Process Leave Request', description: 'Approve/reject leaves', icon: Calendar },
      { label: 'Generate HR Report', description: 'Staff statistics', icon: BarChart3 },
      { label: 'Schedule Training', description: 'Plan capacity building', icon: GraduationCap },
    ],
    kpis: [
      { label: 'Staff Retention Rate', current: 94, target: 95, unit: '%' },
      { label: 'Leave Processing Time', current: 2.3, target: 2, unit: 'days' },
      { label: 'Training Completion', current: 78, target: 85, unit: '%' },
    ],
  },
  2: { // Finance & Budget
    name: 'Finance & Budget',
    shortName: 'Finance',
    icon: Wallet,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    stats: [
      { label: 'Monthly Budget', value: '₦375M', trend: '86% utilized' },
      { label: 'Pending Payments', value: '23', trend: '₦45.2M total' },
      { label: 'Revenue Collected', value: '₦298M', trend: '+8% vs target', trendUp: true },
      { label: 'Audit Items', value: '7', trend: '2 high priority' },
    ],
    tasks: [
      { id: 'FIN-001', title: 'Process contractor payments (₦12.5M)', priority: 'high', dueDate: 'Today' },
      { id: 'FIN-002', title: 'Reconcile January revenue accounts', priority: 'high', dueDate: 'Tomorrow' },
      { id: 'FIN-003', title: 'Prepare Q1 budget performance report', priority: 'medium', dueDate: 'Jan 12' },
      { id: 'FIN-004', title: 'Review procurement requests', priority: 'medium', dueDate: 'Jan 10' },
    ],
    quickActions: [
      { label: 'Process Payment', description: 'Approve disbursements', icon: Wallet },
      { label: 'Record Revenue', description: 'Log income received', icon: TrendingUp },
      { label: 'Budget Report', description: 'Generate statements', icon: FileText },
      { label: 'Audit Checklist', description: 'Review compliance', icon: ClipboardList },
    ],
    kpis: [
      { label: 'Budget Utilization', current: 86, target: 90, unit: '%' },
      { label: 'Revenue Collection', current: 92, target: 95, unit: '%' },
      { label: 'Payment Processing', current: 3.2, target: 5, unit: 'days' },
    ],
  },
  3: { // Works & Infrastructure
    name: 'Works & Infrastructure',
    shortName: 'Works',
    icon: HardHat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    stats: [
      { label: 'Active Projects', value: '18', trend: '3 near completion' },
      { label: 'Road Repairs', value: '12', trend: '8 in progress' },
      { label: 'Building Permits', value: '34', trend: '15 pending review' },
      { label: 'Inspections Due', value: '9', trend: 'This week' },
    ],
    tasks: [
      { id: 'WKS-001', title: 'Site inspection - Igbogbo Road Phase 2', priority: 'high', dueDate: 'Today' },
      { id: 'WKS-002', title: 'Review building permit applications (8)', priority: 'medium', dueDate: 'Tomorrow' },
      { id: 'WKS-003', title: 'Update project milestone tracker', priority: 'medium', dueDate: 'Jan 10' },
      { id: 'WKS-004', title: 'Contractor evaluation meeting', priority: 'high', dueDate: 'Jan 8' },
    ],
    quickActions: [
      { label: 'Log Site Inspection', description: 'Record findings', icon: ClipboardList },
      { label: 'Process Permit', description: 'Building approvals', icon: FileText },
      { label: 'Update Project', description: 'Track milestones', icon: FolderOpen },
      { label: 'Schedule Inspection', description: 'Plan site visits', icon: Calendar },
    ],
    kpis: [
      { label: 'Project Completion Rate', current: 78, target: 85, unit: '%' },
      { label: 'Permit Processing', current: 12, target: 14, unit: 'days' },
      { label: 'Road Quality Index', current: 72, target: 80, unit: '%' },
    ],
  },
  4: { // Health Services
    name: 'Health Services',
    shortName: 'Health',
    icon: Stethoscope,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    stats: [
      { label: 'Health Centers', value: '12', trend: 'All operational' },
      { label: 'Patients This Week', value: '1,247', trend: '+5% vs last week', trendUp: true },
      { label: 'Immunizations', value: '342', trend: 'January target: 500' },
      { label: 'Outreach Programs', value: '4', trend: 'Scheduled this month' },
    ],
    tasks: [
      { id: 'HLT-001', title: 'Review vaccine inventory levels', priority: 'high', dueDate: 'Today' },
      { id: 'HLT-002', title: 'Coordinate community health outreach', priority: 'medium', dueDate: 'Jan 12' },
      { id: 'HLT-003', title: 'Submit monthly disease surveillance report', priority: 'high', dueDate: 'Jan 10' },
      { id: 'HLT-004', title: 'Inspect PHC facilities (3 pending)', priority: 'medium', dueDate: 'Jan 15' },
    ],
    quickActions: [
      { label: 'Log Patient Data', description: 'Record visits', icon: ClipboardList },
      { label: 'Vaccine Report', description: 'Immunization stats', icon: BarChart3 },
      { label: 'Schedule Outreach', description: 'Community programs', icon: Calendar },
      { label: 'Health Alert', description: 'Disease notification', icon: AlertCircle },
    ],
    kpis: [
      { label: 'Immunization Coverage', current: 68, target: 80, unit: '%' },
      { label: 'PHC Utilization', current: 75, target: 85, unit: '%' },
      { label: 'Maternal Care Visits', current: 82, target: 90, unit: '%' },
    ],
  },
  5: { // Education
    name: 'Education',
    shortName: 'Education',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    stats: [
      { label: 'Public Schools', value: '28', trend: '15 primary, 13 secondary' },
      { label: 'Student Enrollment', value: '12,450', trend: '+320 this term', trendUp: true },
      { label: 'Teachers', value: '486', trend: '12 vacancies' },
      { label: 'School Inspections', value: '8', trend: 'Completed this month' },
    ],
    tasks: [
      { id: 'EDU-001', title: 'Review teacher deployment requests', priority: 'high', dueDate: 'Today' },
      { id: 'EDU-002', title: 'Prepare term assessment report', priority: 'medium', dueDate: 'Jan 15' },
      { id: 'EDU-003', title: 'Coordinate school feeding program', priority: 'high', dueDate: 'Jan 8' },
      { id: 'EDU-004', title: 'Process scholarship applications (45)', priority: 'medium', dueDate: 'Jan 20' },
    ],
    quickActions: [
      { label: 'School Inspection', description: 'Log visit report', icon: ClipboardList },
      { label: 'Teacher Transfer', description: 'Process requests', icon: Users },
      { label: 'Enrollment Stats', description: 'Student numbers', icon: BarChart3 },
      { label: 'Scholarship Review', description: 'Process applications', icon: GraduationCap },
    ],
    kpis: [
      { label: 'School Attendance', current: 89, target: 95, unit: '%' },
      { label: 'Teacher-Student Ratio', current: 1, target: 1, unit: ':35' },
      { label: 'LGEA Exam Pass Rate', current: 72, target: 80, unit: '%' },
    ],
  },
  6: { // Agriculture & Rural Development
    name: 'Agriculture & Rural Development',
    shortName: 'Agriculture',
    icon: Tractor,
    color: 'text-lime-600',
    bgColor: 'bg-lime-100',
    stats: [
      { label: 'Registered Farmers', value: '2,340', trend: '+156 this quarter', trendUp: true },
      { label: 'Active Programs', value: '6', trend: 'Farming season initiatives' },
      { label: 'Land Allocations', value: '45', trend: '12 pending' },
      { label: 'Extension Visits', value: '89', trend: 'This month' },
    ],
    tasks: [
      { id: 'AGR-001', title: 'Process farmer registration applications', priority: 'high', dueDate: 'Today' },
      { id: 'AGR-002', title: 'Coordinate seedling distribution', priority: 'high', dueDate: 'Jan 10' },
      { id: 'AGR-003', title: 'Submit quarterly agricultural report', priority: 'medium', dueDate: 'Jan 15' },
      { id: 'AGR-004', title: 'Plan farmer training workshop', priority: 'medium', dueDate: 'Jan 20' },
    ],
    quickActions: [
      { label: 'Register Farmer', description: 'New registration', icon: Users },
      { label: 'Input Distribution', description: 'Track supplies', icon: ClipboardList },
      { label: 'Extension Report', description: 'Field visits', icon: FileText },
      { label: 'Land Allocation', description: 'Process requests', icon: FolderOpen },
    ],
    kpis: [
      { label: 'Farmer Registration', current: 78, target: 85, unit: '%' },
      { label: 'Extension Coverage', current: 65, target: 80, unit: '%' },
      { label: 'Input Distribution', current: 82, target: 90, unit: '%' },
    ],
  },
  7: { // Environment & Sanitation
    name: 'Environment & Sanitation',
    shortName: 'Environment',
    icon: Recycle,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    stats: [
      { label: 'Waste Collection Points', value: '156', trend: '12 new locations' },
      { label: 'Sanitation Complaints', value: '34', trend: '18 resolved' },
      { label: 'Environmental Permits', value: '23', trend: '8 pending' },
      { label: 'Clean-up Exercises', value: '4', trend: 'Scheduled this month' },
    ],
    tasks: [
      { id: 'ENV-001', title: 'Review environmental impact assessments (5)', priority: 'high', dueDate: 'Today' },
      { id: 'ENV-002', title: 'Coordinate community clean-up exercise', priority: 'medium', dueDate: 'Jan 12' },
      { id: 'ENV-003', title: 'Process sanitation complaints', priority: 'high', dueDate: 'Tomorrow' },
      { id: 'ENV-004', title: 'Inspect waste disposal sites', priority: 'medium', dueDate: 'Jan 10' },
    ],
    quickActions: [
      { label: 'Log Complaint', description: 'Sanitation issues', icon: AlertCircle },
      { label: 'Issue Permit', description: 'Environmental approval', icon: FileText },
      { label: 'Schedule Clean-up', description: 'Community exercise', icon: Calendar },
      { label: 'Inspection Report', description: 'Site findings', icon: ClipboardList },
    ],
    kpis: [
      { label: 'Waste Collection Rate', current: 72, target: 85, unit: '%' },
      { label: 'Complaint Resolution', current: 68, target: 80, unit: '%' },
      { label: 'Green Space Coverage', current: 15, target: 20, unit: '%' },
    ],
  },
  8: { // Social Welfare & Community Development
    name: 'Social Welfare & Community Development',
    shortName: 'Social Welfare',
    icon: HandHeart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    stats: [
      { label: 'Beneficiaries', value: '3,450', trend: 'Registered households' },
      { label: 'Active Programs', value: '8', trend: 'Social intervention' },
      { label: 'Pending Applications', value: '127', trend: '45 high priority' },
      { label: 'Community Meetings', value: '6', trend: 'Scheduled this month' },
    ],
    tasks: [
      { id: 'SOC-001', title: 'Process welfare assistance applications (23)', priority: 'high', dueDate: 'Today' },
      { id: 'SOC-002', title: 'Coordinate widow support program disbursement', priority: 'high', dueDate: 'Jan 8' },
      { id: 'SOC-003', title: 'Plan community development meeting', priority: 'medium', dueDate: 'Jan 15' },
      { id: 'SOC-004', title: 'Review youth empowerment applications', priority: 'medium', dueDate: 'Jan 12' },
    ],
    quickActions: [
      { label: 'Register Beneficiary', description: 'New application', icon: Users },
      { label: 'Process Assistance', description: 'Welfare support', icon: HandHeart },
      { label: 'Community Report', description: 'Development stats', icon: BarChart3 },
      { label: 'Schedule Meeting', description: 'Town hall/CDC', icon: Calendar },
    ],
    kpis: [
      { label: 'Beneficiary Reach', current: 65, target: 80, unit: '%' },
      { label: 'Application Processing', current: 14, target: 10, unit: 'days' },
      { label: 'Program Satisfaction', current: 78, target: 85, unit: '%' },
    ],
  },
};

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
  { icon: LayoutDashboard, label: 'Overview', href: '/staff' },
  { icon: Building2, label: 'My Department', href: '/staff/department', active: true },
  { icon: ClipboardList, label: 'Service Requests', href: '/staff/requests', badge: '12' },
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

export default function DepartmentDashboardPage() {
  const navigate = useNavigate();
  const { user, isPending, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);

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

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const staffProfile = extendedUser?.staffProfile;
  const isAdmin = staffProfile && ['super_admin', 'chairman', 'lcda_secretary'].includes(staffProfile.role);
  
  // Get department config - default to Admin & HR if no department assigned
  const deptId = staffProfile?.department_id || 1;
  const deptConfig = departmentConfigs[deptId] || departmentConfigs[1];
  const DeptIcon = deptConfig.icon;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
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
                  flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
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
        <header className="sticky top-0 z-30 bg-white border-b px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search department..." 
                  className="pl-9 w-64 bg-gray-50 border-0 focus-visible:bg-white focus-visible:ring-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                View Public Site
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-4 lg:p-6">
          {/* Department Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link to="/staff" className="hover:text-primary">Dashboard</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Department</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${deptConfig.bgColor} rounded-2xl flex items-center justify-center`}>
                <DeptIcon className={`w-7 h-7 ${deptConfig.color}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {deptConfig.name}
                </h1>
                <p className="text-muted-foreground">
                  {staffProfile?.job_title || 'Staff'} • {roleLabels[staffProfile?.role || 'department_staff']}
                </p>
              </div>
            </div>
          </div>

          {/* Department Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {deptConfig.stats.map((stat, idx) => (
              <Card key={idx} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${stat.trendUp ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {stat.trendUp && <TrendingUp className="w-3 h-3" />}
                    {!stat.trendUp && <CircleDot className="w-3 h-3" />}
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Pending Tasks */}
            <Card className="lg:col-span-2 border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pending Tasks</CardTitle>
                  <Badge variant="secondary">{deptConfig.tasks.length} items</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deptConfig.tasks.map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-2 h-10 rounded-full
                          ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'}
                        `} />
                        <div>
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{task.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Due: {task.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  {deptConfig.quickActions.map((action, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      className="w-full justify-start gap-3 h-auto py-3"
                    >
                      <action.icon className={`w-5 h-5 ${deptConfig.color}`} />
                      <span className="text-left">
                        <span className="block font-medium">{action.label}</span>
                        <span className="block text-xs text-muted-foreground">{action.description}</span>
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KPIs Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Key Performance Indicators</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  View Full Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {deptConfig.kpis.map((kpi, idx) => {
                  const percentage = (kpi.current / kpi.target) * 100;
                  const isOnTrack = percentage >= 90;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{kpi.label}</span>
                        <span className={`text-sm font-bold ${isOnTrack ? 'text-green-600' : 'text-amber-600'}`}>
                          {kpi.current}{kpi.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isOnTrack ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Current: {kpi.current}{kpi.unit}</span>
                        <span>Target: {kpi.target}{kpi.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Department Announcements */}
          <Card className="mt-6 border-0 shadow-sm border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Department Notice</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Weekly department meeting scheduled for Thursday at 2:00 PM. All staff members are expected to submit their weekly reports before the meeting.
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
