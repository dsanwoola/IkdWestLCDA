import { Link } from 'react-router';
import { 
  ArrowRight, 
  FileText, 
  Users, 
  Building2, 
  Leaf, 
  GraduationCap,
  Heart,
  Landmark,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Shield,
  Handshake,
  Eye
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent } from '@/react-app/components/ui/card';
import Layout from '@/react-app/components/layout/Layout';

// Stats data
const stats = [
  { label: 'Population Served', value: '500K+', icon: Users },
  { label: 'Completed Projects', value: '127', icon: Building2 },
  { label: 'Active Services', value: '24', icon: FileText },
  { label: 'Communities', value: '15', icon: MapPin },
];

// Services data
const services = [
  { 
    title: 'Environmental Services', 
    description: 'Waste management, sanitation, and environmental complaints',
    icon: Leaf,
    color: 'bg-emerald-500'
  },
  { 
    title: 'Infrastructure & Roads', 
    description: 'Report road issues and infrastructure concerns',
    icon: Building2,
    color: 'bg-blue-500'
  },
  { 
    title: 'Health Services', 
    description: 'Primary healthcare and community health programs',
    icon: Heart,
    color: 'bg-rose-500'
  },
  { 
    title: 'Education Support', 
    description: 'School programs and educational initiatives',
    icon: GraduationCap,
    color: 'bg-purple-500'
  },
  { 
    title: 'Business Registration', 
    description: 'Market stall requests and business permits',
    icon: Landmark,
    color: 'bg-amber-500'
  },
  { 
    title: 'Civil Registration', 
    description: 'Marriage certificates and vital records',
    icon: FileText,
    color: 'bg-teal-500'
  },
];

// News data
const news = [
  {
    id: 1,
    title: 'Chairman Launches New Road Rehabilitation Project in Agric Area',
    excerpt: 'A comprehensive road rehabilitation project covering 5km of major roads has been inaugurated...',
    date: '2024-01-15',
    category: 'Projects',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    title: 'Free Health Outreach Program Reaches 2,000 Residents',
    excerpt: 'The quarterly health outreach program provided free medical checkups and medications...',
    date: '2024-01-12',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'Youth Empowerment Initiative: Skills Training Registration Open',
    excerpt: 'Registration is now open for the 2024 youth skills acquisition program covering various trades...',
    date: '2024-01-10',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop'
  },
];

// Projects data
const projects = [
  {
    title: 'Ikorodu-Agric Road Expansion',
    status: 'In Progress',
    progress: 65,
    location: 'Agric Ward'
  },
  {
    title: 'Primary Healthcare Center',
    status: 'In Progress',
    progress: 80,
    location: 'Owutu'
  },
  {
    title: 'Market Modernization',
    status: 'Completed',
    progress: 100,
    location: 'Central Market'
  },
];

// Core values
const coreValues = [
  { icon: Shield, title: 'Integrity', description: 'Upholding the highest ethical standards' },
  { icon: Eye, title: 'Transparency', description: 'Open governance and accountability' },
  { icon: Handshake, title: 'Service', description: 'Dedicated to citizen welfare' },
  { icon: TrendingUp, title: 'Excellence', description: 'Striving for quality in all we do' },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
style={{ 
              backgroundImage: 'url(/assets/mocha/ikd-west-building.jpg)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-sm text-white/90">Official Government Portal</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ikorodu West
              <span className="block text-secondary">Local Council Development Area</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
              Serving the people of Ikorodu with transparency, accountability, and a commitment 
              to sustainable development. Building a better community together.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg">
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 h-14 text-lg backdrop-blur-sm">
                <Link to="/services/request">
                  Report an Issue
                </Link>
              </Button>
            </div>

            {/* Quick stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3">
                    <stat.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {coreValues.map((value) => (
              <div key={value.title} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Citizen Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access government services, report issues, and engage with your local council 
              through our digital service portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <Link 
                    to="/services" 
                    className="inline-flex items-center text-primary font-medium text-sm hover:gap-2 transition-all"
                  >
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link to="/services">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Chairman's Message Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative">
                <img 
                  src="/assets/mocha/chairman-ikd-west.jpg"
                  alt="Chairman"
                  className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-xs">
                  <p className="text-sm text-muted-foreground italic">
                    "Building a prosperous Ikorodu West through inclusive governance"
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Leadership</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Message from the Chairman
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Welcome to the official portal of Ikorodu West Local Council Development Area. 
                Our administration is committed to transforming governance through transparency, 
                citizen engagement, and sustainable development.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We believe in the power of community participation and have invested significantly 
                in digital infrastructure to bring government services closer to our people. 
                Together, we are building a model local government that works for everyone.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-0.5 bg-secondary" />
                <div>
                  <p className="font-semibold text-foreground">Hon. Otunba Suliamon Kazeem Olarewaju FCA, FCTI</p>
                  <p className="text-sm text-muted-foreground">Executive Chairman, Ikorodu West LCDA</p>
                </div>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/chairman">
                  Visit Chairman's Office
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Development</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Ongoing Projects
              </h2>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/projects">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.title} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {project.location}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Stay Updated</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Latest News & Announcements
              </h2>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/news">
                All News
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.date).toLocaleDateString('en-NG', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>
                  <Link 
                    to={`/news/${item.id}`}
                    className="inline-flex items-center text-primary font-medium text-sm hover:gap-2 transition-all"
                  >
                    Read more <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Have an Issue to Report?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Our citizen service portal allows you to submit requests, report issues, 
            and track the status of your submissions in real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Link to="/services/request">
                Submit a Request
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link to="/services/track">
                Track Your Request
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Events/Calendar Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Community</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Upcoming Events
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Town Hall Meeting', 
                date: 'January 25, 2024', 
                time: '10:00 AM',
                location: 'LCDA Secretariat Hall'
              },
              { 
                title: 'Health Outreach Program', 
                date: 'February 2, 2024', 
                time: '9:00 AM',
                location: 'Agric Community Center'
              },
              { 
                title: 'Youth Empowerment Summit', 
                date: 'February 15, 2024', 
                time: '11:00 AM',
                location: 'Ikorodu Town Hall'
              },
            ].map((event, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-primary">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-xs text-primary uppercase">
                        {new Date(event.date).toLocaleDateString('en-NG', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                        <Clock className="w-3.5 h-3.5" /> {event.time}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {event.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
