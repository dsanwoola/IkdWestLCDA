import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/lib/auth';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock, 
  CheckCircle, 
  Wrench,
  AlertCircle,
  Loader2,
  X,
  MapPin,
  Calendar,
  Building2,
  TrendingUp,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { Input } from '@/react-app/components/ui/input';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  location_name: string;
  location_lat: number | null;
  location_lng: number | null;
  budget: number | null;
  spent: number | null;
  progress: number;
  contractor: string;
  start_date: string | null;
  end_date: string | null;
  featured_image: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  completed: number;
  ongoing: number;
  planned: number;
  paused: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  ongoing: { label: 'Ongoing', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Wrench },
  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  paused: { label: 'Paused', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle }
};

const categoryLabels: Record<string, string> = {
  roads: 'Roads & Bridges',
  health: 'Health Facilities',
  education: 'Schools',
  water: 'Water & Drainage',
  markets: 'Markets',
  recreation: 'Recreation',
  housing: 'Housing',
  infrastructure: 'Infrastructure'
};

export default function ProjectsManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/staff/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/cms/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/cms/projects/${projectToDelete.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectToDelete.id));
        setShowDeleteModal(false);
        setProjectToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setDeleting(false);
    }
  };

  const stats: Stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    planned: projects.filter(p => p.status === 'planned').length,
    paused: projects.filter(p => p.status === 'paused').length
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.contractor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/staff" className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Projects Management</h1>
                <p className="text-sm text-muted-foreground">Manage LCDA development projects</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/projects" target="_blank">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Public Page
                </Button>
              </Link>
              <Link to="/staff/cms/projects/new">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
                <Building2 className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ongoing</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.ongoing}</p>
                </div>
                <Wrench className="w-8 h-8 text-amber-500/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Planned</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.planned}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paused</p>
                  <p className="text-2xl font-bold text-red-600">{stats.paused}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, locations, contractors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-background border border-input rounded-lg text-sm appearance-none cursor-pointer min-w-[140px]"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="planned">Planned</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-background border border-input rounded-lg text-sm appearance-none cursor-pointer min-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  <option value="roads">Roads & Bridges</option>
                  <option value="health">Health Facilities</option>
                  <option value="education">Schools</option>
                  <option value="water">Water & Drainage</option>
                  <option value="markets">Markets</option>
                  <option value="recreation">Recreation</option>
                  <option value="housing">Housing</option>
                  <option value="infrastructure">Infrastructure</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardContent className="p-0">
            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by adding your first project'}
                </p>
                <Link to="/staff/cms/projects/new">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredProjects.map((project) => {
                  const status = statusConfig[project.status] || statusConfig.planned;
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={project.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {project.featured_image ? (
                            <img 
                              src={project.featured_image} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground line-clamp-1">{project.title}</h3>
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                {project.location_name && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {project.location_name}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(project.start_date)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${status.color} gap-1`}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </Badge>
                              <Badge variant="outline">
                                {categoryLabels[project.category] || project.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                            {project.description || 'No description'}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground font-medium">{formatCurrency(project.budget)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary rounded-full transition-all"
                                      style={{ width: `${project.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-foreground font-medium">{project.progress}%</span>
                                </div>
                              </div>
                              {project.contractor && (
                                <span className="text-muted-foreground">
                                  Contractor: <span className="text-foreground">{project.contractor}</span>
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Link to={`/projects`} target="_blank">
                                <Button variant="ghost" size="sm" className="gap-1">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link to={`/staff/cms/projects/${project.id}`}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setProjectToDelete(project);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results count */}
        {filteredProjects.length > 0 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Delete Project</h2>
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <strong className="text-foreground">{projectToDelete.title}</strong>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
                className="gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
