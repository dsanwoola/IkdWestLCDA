import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  FileText, Megaphone, FolderKanban, Plus, Edit, Trash2, Eye, 
  ArrowLeft, Search, Filter, MoreHorizontal, Calendar, User,
  CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/react-app/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/react-app/components/ui/dialog';
import { Badge } from '@/react-app/components/ui/badge';

type ContentType = 'articles' | 'announcements' | 'projects';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: string;
  is_featured: number;
  author_name: string;
  published_at: string;
  created_at: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  priority: string;
  status: string;
  starts_at: string;
  expires_at: string;
  author_name: string;
  created_at: string;
}

interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  progress: number;
  budget: number;
  location_name: string;
  author_name: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; className: string }> = {
  published: { label: 'Published', icon: CheckCircle, className: 'bg-green-100 text-green-700' },
  draft: { label: 'Draft', icon: Clock, className: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Archived', icon: XCircle, className: 'bg-gray-100 text-gray-700' },
  planned: { label: 'Planned', icon: Clock, className: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Ongoing', icon: AlertCircle, className: 'bg-orange-100 text-orange-700' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'bg-green-100 text-green-700' },
  suspended: { label: 'Suspended', icon: XCircle, className: 'bg-red-100 text-red-700' },
};

export default function CMSPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentType>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: ContentType; id: number; title: string }>({
    open: false, type: 'articles', id: 0, title: ''
  });

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cms/${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        if (activeTab === 'articles') setArticles(data);
        else if (activeTab === 'announcements') setAnnouncements(data);
        else setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/cms/${deleteDialog.type}/${deleteDialog.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        void fetchContent();
        setDeleteDialog({ open: false, type: 'articles', id: 0, title: '' });
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: 'articles' as const, label: 'News Articles', icon: FileText, count: articles.length },
    { id: 'announcements' as const, label: 'Announcements', icon: Megaphone, count: announcements.length },
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban, count: projects.length },
  ];

  const getFilteredArticles = () => {
    return articles.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredAnnouncements = () => {
    return announcements.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredProjects = () => {
    return projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge className={`${config.className} gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/staff" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Content Management</h1>
                <p className="text-sm text-gray-500">Manage website content</p>
              </div>
            </div>
            <Button onClick={() => navigate(`/staff/cms/${activeTab}/new`)} className="bg-green-700 hover:bg-green-800">
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-green-600' : 'bg-gray-100'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading content...</div>
          ) : (
            <>
              {/* Articles Table */}
              {activeTab === 'articles' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getFilteredArticles().length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No articles found. Create your first article!
                          </td>
                        </tr>
                      ) : (
                        getFilteredArticles().map((article) => (
                          <tr key={article.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{article.title}</p>
                                  {article.is_featured === 1 && (
                                    <span className="text-xs text-amber-600 font-medium">★ Featured</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">{article.category || 'Uncategorized'}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={article.status} />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {article.author_name || 'Unknown'}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(article.published_at || article.created_at)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigate(`/staff/cms/articles/${article.id}`)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => setDeleteDialog({ open: true, type: 'articles', id: article.id, title: article.title })}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Announcements Table */}
              {activeTab === 'announcements' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getFilteredAnnouncements().length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No announcements found. Create your first announcement!
                          </td>
                        </tr>
                      ) : (
                        getFilteredAnnouncements().map((ann) => (
                          <tr key={ann.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                  <Megaphone className="w-5 h-5 text-amber-700" />
                                </div>
                                <p className="font-medium text-gray-900">{ann.title}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="capitalize">{ann.type}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={
                                ann.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                ann.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }>
                                {ann.priority}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={ann.status} />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatDate(ann.expires_at)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigate(`/staff/cms/announcements/${ann.id}`)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => setDeleteDialog({ open: true, type: 'announcements', id: ann.id, title: ann.title })}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Projects Table */}
              {activeTab === 'projects' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getFilteredProjects().length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No projects found. Create your first project!
                          </td>
                        </tr>
                      ) : (
                        getFilteredProjects().map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FolderKanban className="w-5 h-5 text-blue-700" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{project.title}</p>
                                  <p className="text-sm text-gray-500">{project.location_name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline">{project.category || 'General'}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={project.status} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-green-600 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">{project.progress}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatCurrency(project.budget)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigate(`/staff/cms/projects/${project.id}`)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => setDeleteDialog({ open: true, type: 'projects', id: project.id, title: project.title })}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete "{deleteDialog.title}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
