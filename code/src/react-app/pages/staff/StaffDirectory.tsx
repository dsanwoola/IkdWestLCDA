import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/lib/auth';
import {
  ArrowLeft,
  Search,
  Users,
  Phone,
  Mail,
  Building2,
  Briefcase,
  Filter,
  Loader2,
  Shield,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Input } from '@/react-app/components/ui/input';
import { Badge } from '@/react-app/components/ui/badge';

interface StaffMember {
  id: number;
  mocha_user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  department_id: number | null;
  job_title: string | null;
  profile_photo: string | null;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
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

const roleColors: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
  chairman: 'bg-amber-100 text-amber-800 border-amber-200',
  lcda_secretary: 'bg-blue-100 text-blue-800 border-blue-200',
  hod: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  department_staff: 'bg-slate-100 text-slate-800 border-slate-200',
  digital_champion: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  citizen: 'bg-gray-100 text-gray-800 border-gray-200'
};

const departments = [
  { id: 1, name: 'Administration & Human Resources', code: 'ADMIN' },
  { id: 2, name: 'Finance & Budget', code: 'FINANCE' },
  { id: 3, name: 'Works & Infrastructure', code: 'WORKS' },
  { id: 4, name: 'Health & Environment', code: 'HEALTH' },
  { id: 5, name: 'Education & Social Services', code: 'EDUCATION' },
  { id: 6, name: 'Agriculture & Rural Development', code: 'AGRICULTURE' },
  { id: 7, name: 'Environmental Sanitation', code: 'ENVIRONMENT' },
  { id: 8, name: 'Community Development', code: 'COMMUNITY' }
];

export default function StaffDirectory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/staff/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (deptId: number | null) => {
    if (!deptId) return 'Unassigned';
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'Unknown';
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      (member.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (member.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (member.job_title?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || 
      member.department_id?.toString() === selectedDepartment;
    
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Group staff by department
  const staffByDepartment = filteredStaff.reduce((acc, member) => {
    const deptName = getDepartmentName(member.department_id);
    if (!acc[deptName]) {
      acc[deptName] = [];
    }
    acc[deptName].push(member);
    return acc;
  }, {} as Record<string, StaffMember[]>);

  // Sort departments with assigned ones first
  const sortedDepartments = Object.keys(staffByDepartment).sort((a, b) => {
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b);
  });

  const totalActiveStaff = staff.filter(s => s.is_active).length;
  const totalDepartments = new Set(staff.filter(s => s.department_id).map(s => s.department_id)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-600">Loading staff directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/staff">
              <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8" />
              Staff Directory
            </h1>
            <p className="text-emerald-100 mt-1">
              View all LCDA staff members and their contact information
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{staff.length}</p>
                  <p className="text-sm text-slate-500">Total Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totalActiveStaff}</p>
                  <p className="text-sm text-slate-500">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totalDepartments}</p>
                  <p className="text-sm text-slate-500">Departments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {staff.filter(s => s.role === 'hod').length}
                  </p>
                  <p className="text-sm text-slate-500">HODs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </option>
                    ))}
                    <option value="unassigned">Unassigned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="chairman">Chairman</option>
                    <option value="lcda_secretary">LCDA Secretary</option>
                    <option value="hod">Head of Department</option>
                    <option value="department_staff">Department Staff</option>
                    <option value="digital_champion">Digital Champion</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{filteredStaff.length}</span> of {staff.length} staff members
          </p>
        </div>

        {/* Staff by Department */}
        {filteredStaff.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Staff Found</h3>
              <p className="text-slate-500">
                {searchQuery || selectedDepartment !== 'all' || selectedRole !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No staff members have been registered yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {sortedDepartments.map(deptName => (
              <div key={deptName}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{deptName}</h2>
                    <p className="text-sm text-slate-500">
                      {staffByDepartment[deptName].length} staff member{staffByDepartment[deptName].length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffByDepartment[deptName].map(member => (
                    <Card 
                      key={member.id} 
                      className={`bg-white border-0 shadow-sm hover:shadow-md transition-shadow ${
                        !member.is_active ? 'opacity-60' : ''
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {member.profile_photo ? (
                              <img
                                src={member.profile_photo}
                                alt={member.full_name || 'Staff'}
                                className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-semibold">
                                {member.full_name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {member.full_name || 'Unnamed Staff'}
                            </h3>
                            {member.job_title && (
                              <p className="text-sm text-slate-600 truncate flex items-center gap-1">
                                <Briefcase className="w-3 h-3 flex-shrink-0" />
                                {member.job_title}
                              </p>
                            )}
                            <div className="mt-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${roleColors[member.role] || roleColors.citizen}`}
                              >
                                {roleLabels[member.role] || member.role}
                              </Badge>
                              {!member.is_active && (
                                <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-700 border-red-200">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                          <a 
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                          >
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </a>
                          {member.phone && (
                            <a 
                              href={`tel:${member.phone}`}
                              className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                            >
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{member.phone}</span>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
