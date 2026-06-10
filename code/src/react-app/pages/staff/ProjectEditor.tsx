import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, CheckCircle, MapPin, Calendar, Wallet, Image, Trash2
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Label } from '@/react-app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/react-app/components/ui/select';
import { Slider } from '@/react-app/components/ui/slider';

const categories = [
  'Infrastructure',
  'Healthcare',
  'Education',
  'Water & Sanitation',
  'Road Construction',
  'Public Buildings',
  'Environment',
  'Social Welfare',
];

const statuses = [
  { value: 'planned', label: 'Planned' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'suspended', label: 'Suspended' },
];

export default function ProjectEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id && id !== 'new');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    status: 'planned',
    location_name: '',
    location_lat: '',
    location_lng: '',
    budget: '',
    spent: '',
    progress: 0,
    contractor: '',
    start_date: '',
    end_date: '',
    featured_image: '',
  });

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cms/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject({
          ...data,
          budget: data.budget?.toString() || '',
          spent: data.spent?.toString() || '',
          location_lat: data.location_lat?.toString() || '',
          location_lng: data.location_lng?.toString() || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      void fetchProject();
    }
  }, [fetchProject, isEditing]);

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setProject(prev => ({
      ...prev,
      title,
      slug: !isEditing || !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...project,
        budget: parseFloat(project.budget) || 0,
        spent: parseFloat(project.spent) || 0,
        location_lat: parseFloat(project.location_lat) || null,
        location_lng: parseFloat(project.location_lng) || null,
        start_date: project.start_date || null,
        end_date: project.end_date || null,
      };

      const url = isEditing ? `/api/cms/projects/${id}` : '/api/cms/projects';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/staff/cms');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/staff/cms" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Project' : 'New Project'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                className="bg-green-700 hover:bg-green-800" 
                onClick={handleSave}
                disabled={saving}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Project' : 'Save Project'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <Label className="text-sm text-gray-700">Project Title</Label>
                <Input
                  value={project.title}
                  onChange={handleTitleChange}
                  placeholder="e.g., Ikorodu-Aga Road Rehabilitation"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-700">URL Slug</Label>
                <Input
                  value={project.slug}
                  onChange={(e) => setProject(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="project-url-slug"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700">Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed project description..."
                  className="mt-1"
                  rows={5}
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h2>
              
              <div>
                <Label className="text-sm text-gray-700">Location Name</Label>
                <Input
                  value={project.location_name}
                  onChange={(e) => setProject(prev => ({ ...prev, location_name: e.target.value }))}
                  placeholder="e.g., Ikorodu-Aga Junction"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-700">Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={project.location_lat}
                    onChange={(e) => setProject(prev => ({ ...prev, location_lat: e.target.value }))}
                    placeholder="6.6194"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700">Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={project.location_lng}
                    onChange={(e) => setProject(prev => ({ ...prev, location_lng: e.target.value }))}
                    placeholder="3.5105"
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Coordinates for map marker. Get from Google Maps by right-clicking a location.
              </p>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Budget & Spending
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-700">Total Budget (₦)</Label>
                  <Input
                    type="number"
                    value={project.budget}
                    onChange={(e) => setProject(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="50000000"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-700">Amount Spent (₦)</Label>
                  <Input
                    type="number"
                    value={project.spent}
                    onChange={(e) => setProject(prev => ({ ...prev, spent: e.target.value }))}
                    placeholder="25000000"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(project.spent)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-700">Contractor</Label>
                <Input
                  value={project.contractor}
                  onChange={(e) => setProject(prev => ({ ...prev, contractor: e.target.value }))}
                  placeholder="Contractor company name"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div>
                <Label className="text-sm text-gray-700">Category</Label>
                <Select
                  value={project.category}
                  onValueChange={(value) => setProject(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-gray-700">Status</Label>
                <Select
                  value={project.status}
                  onValueChange={(value) => setProject(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm text-gray-700">Progress</Label>
                  <span className="text-sm font-medium text-green-700">{project.progress}%</span>
                </div>
                <Slider
                  value={[project.progress]}
                  onValueChange={(value) => setProject(prev => ({ ...prev, progress: value[0] }))}
                  max={100}
                  step={5}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline
              </h3>
              
              <div>
                <Label className="text-sm text-gray-700">Start Date</Label>
                <Input
                  type="date"
                  value={project.start_date}
                  onChange={(e) => setProject(prev => ({ ...prev, start_date: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-700">Expected End Date</Label>
                <Input
                  type="date"
                  value={project.end_date}
                  onChange={(e) => setProject(prev => ({ ...prev, end_date: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Featured Image
              </Label>
              {project.featured_image ? (
                <div className="mt-3 relative">
                  <img 
                    src={project.featured_image} 
                    alt="Featured" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setProject(prev => ({ ...prev, featured_image: '' }))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-3 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <Image className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">No image</p>
                </div>
              )}
              <Input
                value={project.featured_image}
                onChange={(e) => setProject(prev => ({ ...prev, featured_image: e.target.value }))}
                placeholder="Image URL..."
                className="mt-3"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
