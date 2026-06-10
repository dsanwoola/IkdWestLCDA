import { useState } from 'react';
import { Link } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowRight, 
  Calendar,
  MapPin,
  Filter,
  Building2,
  Wrench,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  LayoutGrid,
  Map,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
  iconUrl: '/assets/leaflet/marker-icon.png',
  shadowUrl: '/assets/leaflet/marker-shadow.png',
});

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const projectStats = [
  { label: 'Total Projects', value: '46', icon: Building2, color: 'bg-primary' },
  { label: 'Completed', value: '21', icon: CheckCircle2, color: 'bg-green-500' },
  { label: 'Ongoing', value: '16', icon: Wrench, color: 'bg-amber-500' },
  { label: 'Planned', value: '9', icon: Clock, color: 'bg-blue-500' }
];

const categories = [
  { id: 'all', name: 'All Projects' },
  { id: 'buildings', name: 'Buildings' },
  { id: 'roads', name: 'Roads & Bridges' },
  { id: 'health', name: 'Health Facilities' },
  { id: 'education', name: 'Schools' },
  { id: 'water', name: 'Water & Drainage' },
  { id: 'markets', name: 'Markets' },
  { id: 'recreation', name: 'Recreation' }
];

const statuses = [
  { id: 'all', name: 'All Status', color: 'bg-gray-500' },
  { id: 'completed', name: 'Completed', color: 'bg-green-500' },
  { id: 'ongoing', name: 'Ongoing', color: 'bg-amber-500' },
  { id: 'planned', name: 'Planned', color: 'bg-blue-500' },
  { id: 'paused', name: 'Paused', color: 'bg-red-500' }
];

const projects = [
  {
    id: 1,
    name: 'LCDA Secretariat Building Renovation',
    description: 'Complete renovation of the existing LCDA Secretariat building including structural repairs, modern finishes, new roofing, and upgraded facilities for improved service delivery.',
    category: 'buildings',
    status: 'completed',
    progress: 100,
    contractor: 'LCDA Works Department',
    startDate: '2023-01-15',
    endDate: '2024-06-30',
    ward: 'Secretariat Complex',
    location: { lat: 6.6018, lng: 3.5089 },
    image: '/assets/mocha/Bilding-New.jpeg',
    images: [
      { url: '/assets/mocha/Building-old.jpeg', label: 'Before Renovation', phase: 'before' },
      { url: '/assets/mocha/Building-2.jpeg', label: 'During Renovation', phase: 'during' },
      { url: '/assets/mocha/Bilding-New.jpeg', label: 'After Renovation', phase: 'after' }
    ]
  },
  {
    id: 2,
    name: "Executive Chairman's Office Construction",
    description: 'Construction of a new modern executive office building for the Chairman with contemporary design, air conditioning, and befitting workspace for administrative operations.',
    category: 'buildings',
    status: 'completed',
    progress: 100,
    contractor: 'LCDA Works Department',
    startDate: '2023-03-01',
    endDate: '2024-08-15',
    ward: 'Secretariat Complex',
    location: { lat: 6.5920, lng: 3.5250 },
    image: "/assets/mocha/Chairman's-office-2.jpeg",
    images: [
      { url: "/assets/mocha/Chairman's-office.jpeg", label: 'Before Construction', phase: 'before' },
      { url: "/assets/mocha/Chairman's-office-2.jpeg", label: 'Completed Building', phase: 'after' }
    ]
  },
  {
    id: 3,
    name: 'Empowerment of Widows & Elderly Women',
    description: 'WAPA department initiative providing food palliatives, support packages, and economic empowerment for widows and elderly women across Ikorodu West LCDA.',
    category: 'community',
    status: 'completed',
    progress: 100,
    contractor: 'WAPA Department',
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    ward: 'All Wards',
    location: { lat: 6.5850, lng: 3.4980 },
    image: '/assets/mocha/Empowerment-4.jpeg',
    images: [
      { url: '/assets/mocha/Empowerment-1.jpeg', label: 'Beneficiaries Gathering', phase: 'during' },
      { url: '/assets/mocha/Empowerment-2.jpeg', label: 'Food Palliatives Prepared', phase: 'during' },
      { url: '/assets/mocha/Empowerment-3.jpeg', label: 'Distribution Day', phase: 'during' },
      { url: '/assets/mocha/Empowerment-4.jpeg', label: 'Group Photo with Officials', phase: 'after' },
      { url: '/assets/mocha/Empowerment-5.jpeg', label: 'Beneficiaries with Packages', phase: 'after' }
    ]
  },
  {
    id: 4,
    name: 'Distribution of Chairs, Tables, Books & School Bags',
    description: 'Provision of educational furniture and materials including chairs, tables, books and school bags to all public primary schools within Ikorodu West LCDA.',
    category: 'education',
    status: 'completed',
    progress: 100,
    contractor: 'Education Department',
    startDate: '2024-01-10',
    endDate: '2024-03-15',
    ward: 'All Wards',
    location: { lat: 6.6100, lng: 3.5150 },
    image: '/assets/mocha/Education-2.jpeg',
    images: [
      { url: '/assets/mocha/Education-1.jpeg', label: 'Students Using New Desks', phase: 'after' },
      { url: '/assets/mocha/Education-2.jpeg', label: 'Official Presentation Ceremony', phase: 'during' },
      { url: '/assets/mocha/Education-4.jpeg', label: 'Tables Ready for Distribution', phase: 'during' },
      { url: '/assets/mocha/Education-5.jpeg', label: 'Furniture at School Grounds', phase: 'during' },
      { url: '/assets/mocha/Education-6.jpeg', label: 'Community Leaders with New Furniture', phase: 'after' }
    ]
  },
  {
    id: 5,
    name: 'Blood Pressure Machines & Medical Testing for Elderly',
    description: 'Distribution of blood pressure machines and free medical tests to elderly people within Ikorodu West LCDA to promote health awareness and early detection.',
    category: 'health',
    status: 'completed',
    progress: 100,
    contractor: 'Primary Healthcare Department',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    ward: 'All Wards',
    location: { lat: 6.5980, lng: 3.5300 },
    image: '/assets/mocha/Health.jpeg',
    images: [
      { url: '/assets/mocha/Health.jpeg', label: 'Medical Outreach Event', phase: 'during' },
      { url: '/assets/mocha/Health-2.jpeg', label: 'Health Workers at Station', phase: 'during' },
      { url: '/assets/mocha/Health-3.jpeg', label: 'Blood Pressure Testing', phase: 'during' },
      { url: '/assets/mocha/Health-4.jpeg', label: 'Elderly Beneficiaries Gathering', phase: 'during' }
    ]
  },
  {
    id: 6,
    name: 'Food Distribution to 5,000 Households',
    description: 'Distribution of food items including rice and essential supplies to 5,000 households across Ikorodu West LCDA to support residents and reduce hunger.',
    category: 'community',
    status: 'completed',
    progress: 100,
    contractor: 'Social Welfare Department',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    ward: 'All Wards',
    location: { lat: 6.6050, lng: 3.5020 },
    image: '/assets/mocha/Food-Distribution-2.jpeg',
    images: [
      { url: '/assets/mocha/Food-Distribution-1.jpeg', label: 'Beneficiaries Gathering', phase: 'during' },
      { url: '/assets/mocha/Food-Distribution-2.jpeg', label: 'Massive Turnout at Distribution', phase: 'during' },
      { url: '/assets/mocha/Food-Distribution-3.jpeg', label: 'Rice Bags Ready for Distribution', phase: 'during' },
      { url: '/assets/mocha/Food-Distribution-4.jpeg', label: 'Food Items at Distribution Point', phase: 'during' },
      { url: '/assets/mocha/Food-Distribution-5.jpeg', label: 'Community Members Receiving Items', phase: 'during' }
    ]
  },
  {
    id: 7,
    name: 'Interlocking of Bamidele Laditi Street, Owutu',
    description: 'Installation of interlocking paving stones on Bamidele Laditi Street in Owutu, Agric area to improve road accessibility and drainage.',
    category: 'roads',
    status: 'completed',
    progress: 100,
    contractor: 'Works & Infrastructure Department',
    startDate: '2023-06-01',
    endDate: '2024-02-28',
    ward: 'Owutu Ward',
    location: { lat: 6.5780, lng: 3.5400 },
    image: '/assets/mocha/Owutu-Road-1.jpeg',
    images: [
      { url: '/assets/mocha/Owutu-Road-1.jpeg', label: 'Completed Interlocking', phase: 'after' },
      { url: '/assets/mocha/Owutu-road-2.jpeg', label: 'Finished Road with Markings', phase: 'after' },
      { url: '/assets/mocha/Owutu-road-3.jpeg', label: 'Completed Street View', phase: 'after' }
    ]
  },
  {
    id: 8,
    name: 'Total Renovation of UPE Primary School, Ajaguro',
    description: 'Complete renovation of UPE Primary School in Ajaguro including building rehabilitation, new roofing, classroom interiors, and landscaping.',
    category: 'education',
    status: 'completed',
    progress: 100,
    contractor: 'Education Department',
    startDate: '2023-04-01',
    endDate: '2024-01-15',
    ward: 'Ajaguro Ward',
    location: { lat: 6.5900, lng: 3.5100 },
    image: '/assets/mocha/School.jpeg',
    images: [
      { url: '/assets/mocha/School.jpeg', label: 'Renovated School Facilities', phase: 'after' }
    ]
  },
  {
    id: 9,
    name: 'New Ultra Modern West End Event Centre',
    description: 'Construction of a state-of-the-art ultra modern event centre featuring elegant marble flooring, grand chandeliers, spacious main hall with mezzanine level, curved staircase, and modern LED lighting throughout.',
    category: 'recreation',
    status: 'completed',
    progress: 100,
    contractor: 'Works & Infrastructure Department',
    startDate: '2023-06-01',
    endDate: '2024-12-31',
    ward: 'Ikorodu West',
    location: { lat: 6.5950, lng: 3.5150 },
    image: '/assets/mocha/Hall-2.jpeg',
    images: [
      { url: '/assets/mocha/Hall-1.jpeg', label: 'Grand Entrance with LED Lighting', phase: 'after' },
      { url: '/assets/mocha/Hall-2.jpeg', label: 'Main Hall with Chandeliers', phase: 'after' },
      { url: '/assets/mocha/Hall-3.jpeg', label: 'Elegant Curved Staircase', phase: 'after' }
    ]
  },
  {
    id: 10,
    name: 'Mega Empowerment Programme',
    description: 'Distribution of motorcycles, fridges, sewing machines, generators, gas cylinders, umbrellas and other empowerment items to residents of Ikorodu West LCDA to boost economic activities and livelihoods.',
    category: 'community',
    status: 'completed',
    progress: 100,
    contractor: 'Social Welfare Department',
    startDate: '2025-05-30',
    endDate: '2025-05-30',
    ward: 'All Wards',
    location: { lat: 6.6000, lng: 3.5200 },
    image: '/assets/mocha/Empowerment-appliances-1.jpeg',
    images: [
      { url: '/assets/mocha/Empowerment-appliances-1.jpeg', label: 'Freezers & Appliances Display', phase: 'after' },
      { url: '/assets/mocha/Empowerment-appliances-2.jpeg', label: 'Sewing Machines & Generators', phase: 'after' },
      { url: '/assets/mocha/Empowerment-appliances-3.jpeg', label: 'Keke Napep Distribution', phase: 'after' },
      { url: '/assets/mocha/Empowerment-appliances-4.jpeg', label: 'Fridges & Generators Ready for Distribution', phase: 'after' },
      { url: '/assets/mocha/Empowerment-appliances-5.jpeg', label: 'Grinding Machines & Gas Cylinders', phase: 'after' }
    ]
  },
  {
    id: 11,
    name: 'Purchase of Chairs and Tables for Council Staff',
    description: 'Procurement and distribution of ergonomic office chairs and tables to council staff members across all departments to improve workplace comfort and productivity.',
    category: 'community',
    status: 'completed',
    progress: 100,
    contractor: 'Admin & HR Department',
    startDate: '2025-01-01',
    endDate: '2025-02-28',
    ward: 'Secretariat Complex',
    location: { lat: 6.5880, lng: 3.5050 },
    image: '/assets/mocha/chair-2.jpeg',
    images: [
      { url: '/assets/mocha/chair-2.jpeg', label: 'New Chairs & Office Furniture', phase: 'after' },
      { url: '/assets/mocha/Chair-3.jpeg', label: 'Chairs Ready for Distribution', phase: 'after' }
    ]
  },
  {
    id: 12,
    name: 'Project Title Here',
    description: 'Add project description here - explain the scope, objectives, and beneficiaries of this project.',
    category: 'community',
    status: 'planned',
    progress: 0,
    contractor: 'Department Name',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    ward: 'Ward Name',
    location: { lat: 6.6020, lng: 3.4980 },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
    images: []
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'ongoing': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'planned': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'paused': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getMarkerColor = (status: string) => {
  switch (status) {
    case 'completed': return '#22c55e';
    case 'ongoing': return '#f59e0b';
    case 'planned': return '#3b82f6';
    case 'paused': return '#ef4444';
    default: return '#6b7280';
  }
};

const getProgressColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'ongoing': return 'bg-amber-500';
    case 'planned': return 'bg-blue-500';
    case 'paused': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [detailProject, setDetailProject] = useState<typeof projects[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.ward.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Center of Ikorodu West LCDA
  const mapCenter: [number, number] = [6.5950, 3.5150];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Projects</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Development Projects
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
            Track the progress of infrastructure and community development projects 
            across Ikorodu West LCDA. Transparency in governance through open project monitoring.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {projectStats.map((stat, idx) => (
              <Card key={idx} className="border-0 shadow-md">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <Map className="w-4 h-4" />
                Map
              </Button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Filter className="w-4 h-4 text-muted-foreground self-center mr-2" />
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedStatus === status.id 
                    ? 'bg-primary text-white' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${status.color}`} />
                {status.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>

          {viewMode === 'map' ? (
            /* Map View */
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[600px] rounded-xl overflow-hidden shadow-lg border">
                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredProjects.map((project) => (
                    <Marker 
                      key={project.id} 
                      position={[project.location.lat, project.location.lng]}
                      icon={createCustomIcon(getMarkerColor(project.status))}
                      eventHandlers={{
                        click: () => setSelectedProject(project)
                      }}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-semibold text-sm">{project.name}</h3>
                          <p className="text-xs text-gray-600">{project.ward}</p>
                          <Badge className={`mt-1 text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Project List / Details */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {selectedProject ? (
                  <Card className="border-0 shadow-lg">
                    <div className="relative h-40">
                      <img 
                        src={selectedProject.image}
                        alt={selectedProject.name}
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="absolute top-3 right-3"
                        onClick={() => setSelectedProject(null)}
                      >
                        ← Back to List
                      </Button>
                    </div>
                    <CardContent className="p-5">
                      <Badge className={`mb-3 ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status}
                      </Badge>
                      <h3 className="font-bold text-lg mb-2">{selectedProject.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{selectedProject.description}</p>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contractor</span>
                          <span className="font-medium">{selectedProject.contractor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ward</span>
                          <span className="font-medium">{selectedProject.ward}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Timeline</span>
                          <span className="font-medium">
                            {new Date(selectedProject.startDate).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })} - {new Date(selectedProject.endDate).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">{selectedProject.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(selectedProject.status)}`}
                              style={{ width: `${selectedProject.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredProjects.map((project) => (
                    <Card 
                      key={project.id} 
                      className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <CardContent className="p-4 flex gap-4">
                        <div 
                          className="w-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: getMarkerColor(project.status) }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm line-clamp-1">{project.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {project.ward}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                              {project.progress}%
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className={`absolute top-3 left-3 ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{project.ward}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(project.startDate).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor(project.status)}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {project.contractor}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailProject(project);
                          setCurrentImageIndex(0);
                        }}
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Transparency in Development
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            We believe in keeping our citizens informed about how public funds are being used 
            to develop our community. Visit our Budget Transparency portal for detailed financial reports.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Link to="/budget">
                View Budget Portal
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link to="/contact">
                Report a Project Issue
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold">{detailProject.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {detailProject.ward}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setDetailProject(null)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Image Gallery */}
            <div className="relative">
              {detailProject.images && detailProject.images.length > 0 ? (
                <>
                  <div className="relative h-72 md:h-96 bg-slate-100">
                    <img 
                      src={detailProject.images[currentImageIndex].url}
                      alt={detailProject.images[currentImageIndex].label}
                      className="w-full h-full object-cover"
                    />
                    {/* Phase Label */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg ${
                        detailProject.images[currentImageIndex].phase === 'before' ? 'bg-red-500' :
                        detailProject.images[currentImageIndex].phase === 'during' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}>
                        {detailProject.images[currentImageIndex].label}
                      </span>
                    </div>

                    {/* Navigation Arrows */}
                    {detailProject.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev === 0 ? detailProject.images!.length - 1 : prev - 1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev === detailProject.images!.length - 1 ? 0 : prev + 1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {detailProject.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {detailProject.images.length > 1 && (
                    <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800 overflow-x-auto">
                      {detailProject.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === idx ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-72 md:h-80">
                  <img 
                    src={detailProject.image}
                    alt={detailProject.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="p-5 space-y-4 max-h-60 overflow-y-auto">
              <p className="text-muted-foreground">{detailProject.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block">Status</span>
                  <Badge className={getStatusColor(detailProject.status)}>
                    {detailProject.status.charAt(0).toUpperCase() + detailProject.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block">Contractor</span>
                  <span className="font-semibold">{detailProject.contractor}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Progress</span>
                  <span className="font-semibold">{detailProject.progress}%</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Start: {new Date(detailProject.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  End: {new Date(detailProject.endDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-semibold">{detailProject.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all ${getProgressColor(detailProject.status)}`}
                    style={{ width: `${detailProject.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
