import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowRight, 
  Calendar,
  Clock,
  Search,
  Tag,
  Bell,
  Newspaper,
  ChevronRight,
  AlertCircle,
  Megaphone,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';

const categories = [
  { id: 'all', name: 'All News', count: 24 },
  { id: 'infrastructure', name: 'Infrastructure', count: 8 },
  { id: 'health', name: 'Health', count: 5 },
  { id: 'education', name: 'Education', count: 4 },
  { id: 'youth', name: 'Youth & Empowerment', count: 4 },
  { id: 'environment', name: 'Environment', count: 3 }
];

const featuredNews = {
  id: 1,
  title: 'Chairman Inaugurates ₦500 Million Road Network Project in Agric',
  excerpt: 'The Executive Chairman, Hon. Otunba Suliamon Kazeem Olarewaju FCA, FCTI, today flagged off the construction of a comprehensive road network spanning 12 kilometers across four major communities. The project, valued at ₦500 million, is expected to improve transportation and boost economic activities in the area.',
  image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=500&fit=crop',
  category: 'Infrastructure',
  date: '2024-01-15',
  readTime: '5 min read',
  author: 'Media Unit'
};

const newsArticles = [
  {
    id: 2,
    title: 'Free Medical Outreach Benefits Over 3,000 Residents',
    excerpt: 'The quarterly health outreach program provided free consultations, medications, and health screenings to residents across all wards.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop',
    category: 'Health',
    date: '2024-01-12',
    readTime: '3 min read'
  },
  {
    id: 3,
    title: '500 Youths Graduate from Skills Acquisition Program',
    excerpt: 'The first batch of beneficiaries completed training in ICT, fashion design, welding, and other vocational skills.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop',
    category: 'Youth & Empowerment',
    date: '2024-01-10',
    readTime: '4 min read'
  },
  {
    id: 4,
    title: 'LCDA Partners with NGOs for Environmental Cleanup Campaign',
    excerpt: 'A month-long environmental sanitation exercise kicks off across major markets and residential areas.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop',
    category: 'Environment',
    date: '2024-01-08',
    readTime: '3 min read'
  },
  {
    id: 5,
    title: 'New Primary School Building Commissioned in Ijede',
    excerpt: 'The modern 12-classroom block with facilities will accommodate over 600 students.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop',
    category: 'Education',
    date: '2024-01-05',
    readTime: '3 min read'
  },
  {
    id: 6,
    title: 'Street Light Installation Completed in 5 Wards',
    excerpt: 'Solar-powered street lights now illuminate major roads, improving security and extending business hours.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    category: 'Infrastructure',
    date: '2024-01-03',
    readTime: '2 min read'
  },
  {
    id: 7,
    title: 'Agricultural Input Distribution to 1,000 Farmers',
    excerpt: 'Fertilizers, seedlings, and farming tools distributed to registered farmers to boost food production.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
    category: 'Agriculture',
    date: '2023-12-28',
    readTime: '3 min read'
  }
];

const announcements = [
  {
    id: 1,
    title: 'Public Notice: 2024 Budget Town Hall Meeting',
    type: 'important',
    date: '2024-01-20',
    description: 'All residents are invited to the budget presentation and feedback session at the LCDA Secretariat on January 25th, 2024.'
  },
  {
    id: 2,
    title: 'Marriage Registration Exercise',
    type: 'notice',
    date: '2024-01-18',
    description: 'Free marriage registration exercise for eligible couples. Venue: Social Welfare Department. Dates: February 1-14, 2024.'
  },
  {
    id: 3,
    title: 'Environmental Sanitation Day Reminder',
    type: 'reminder',
    date: '2024-01-15',
    description: 'Monthly environmental sanitation holds every last Saturday. All residents must participate in keeping our community clean.'
  },
  {
    id: 4,
    title: 'Recruitment: Community Health Workers',
    type: 'opportunity',
    date: '2024-01-12',
    description: 'Applications open for Community Health Extension Workers. Qualified candidates should apply at the Health Department.'
  }
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Infrastructure': 'bg-amber-100 text-amber-700',
    'Health': 'bg-red-100 text-red-700',
    'Education': 'bg-purple-100 text-purple-700',
    'Youth & Empowerment': 'bg-blue-100 text-blue-700',
    'Environment': 'bg-teal-100 text-teal-700',
    'Agriculture': 'bg-green-100 text-green-700'
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

const getAnnouncementIcon = (type: string) => {
  switch (type) {
    case 'important': return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'notice': return <Bell className="w-5 h-5 text-blue-500" />;
    case 'reminder': return <Clock className="w-5 h-5 text-amber-500" />;
    case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-500" />;
    default: return <Megaphone className="w-5 h-5 text-gray-500" />;
  }
};

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredNews = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                            article.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <span className="text-white">News & Announcements</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            News & Announcements
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
            Stay informed about the latest developments, projects, and announcements 
            from Ikorodu West LCDA.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                  Featured
                </Badge>
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge className={`w-fit mb-4 ${getCategoryColor(featuredNews.category)}`}>
                  {featuredNews.category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {featuredNews.title}
                </h2>
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {featuredNews.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredNews.date).toLocaleDateString('en-NG', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredNews.readTime}
                  </span>
                </div>
                <Button className="w-fit gap-2">
                  Read Full Story
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Search */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search News
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id 
                          ? 'bg-primary text-white' 
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === cat.id ? 'bg-white/20' : 'bg-muted'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <Card className="border-0 shadow-lg bg-primary text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Subscribe to receive news and announcements directly to your inbox.
                  </p>
                  <Input 
                    placeholder="Enter your email"
                    className="bg-white/20 border-white/30 placeholder:text-white/60 text-white mb-3"
                  />
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* News Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Latest News
                </h2>
                <span className="text-muted-foreground text-sm">
                  {filteredNews.length} articles
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredNews.map((article) => (
                  <Card key={article.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className={`absolute top-3 left-3 ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(article.date).toLocaleDateString('en-NG', { 
                              day: 'numeric', month: 'short' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1 text-primary">
                          Read <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )}

              {/* Load More */}
              {filteredNews.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" className="gap-2">
                    Load More Articles
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Official</span>
              <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Public Announcements
              </h2>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 gap-2">
              <Bell className="w-4 h-4" />
              View All Announcements
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      {getAnnouncementIcon(announcement.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs capitalize ${
                            announcement.type === 'important' ? 'border-red-200 text-red-600' :
                            announcement.type === 'opportunity' ? 'border-green-200 text-green-600' :
                            ''
                          }`}
                        >
                          {announcement.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(announcement.date).toLocaleDateString('en-NG', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">{announcement.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {announcement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Have News to Share?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Community organizations and residents can submit news tips and event announcements 
            for consideration by our media team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Link to="/contact">
                Submit a News Tip
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link to="/contact">
                Contact Media Unit
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
