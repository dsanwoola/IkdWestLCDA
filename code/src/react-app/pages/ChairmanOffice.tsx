import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowRight, 
  Download, 
  FileText, 
  Image as ImageIcon,
  Search
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';
import Organogram from '@/react-app/components/Organogram';

// Public records
const publicRecords = [
  { id: 1, title: 'Annual Budget 2024', category: 'Budget', date: '2023-12-15', size: '2.4 MB', downloads: 1250 },
  { id: 2, title: 'Q3 2023 Financial Report', category: 'Finance', date: '2023-10-15', size: '1.8 MB', downloads: 890 },
  { id: 3, title: 'Development Plan 2023-2027', category: 'Planning', date: '2023-06-01', size: '5.2 MB', downloads: 2100 },
  { id: 4, title: 'Procurement Guidelines', category: 'Procurement', date: '2023-03-10', size: '980 KB', downloads: 650 },
  { id: 5, title: 'Q2 2023 Financial Report', category: 'Finance', date: '2023-07-15', size: '1.6 MB', downloads: 780 },
  { id: 6, title: 'Environmental Policy Document', category: 'Policy', date: '2023-05-20', size: '1.2 MB', downloads: 420 },
];

// Gallery images
const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&h=300&fit=crop', caption: 'Community Town Hall Meeting' },
  { id: 2, src: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop', caption: 'Road Project Inauguration' },
  { id: 3, src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop', caption: 'Healthcare Outreach Program' },
  { id: 4, src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop', caption: 'Youth Empowerment Workshop' },
  { id: 5, src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop', caption: 'School Renovation Project' },
  { id: 6, src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop', caption: 'Independence Day Celebration' },
];

export default function ChairmanOfficePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRecords = publicRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || record.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(publicRecords.map(r => r.category))];

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
            <span className="text-white">Chairman's Office</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Chairman's Office
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
            The office of the Executive Chairman — leading Ikorodu West LCDA with vision, 
            transparency, and a commitment to sustainable development.
          </p>
        </div>
      </section>

      {/* Chairman Profile & Message */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-xl sticky top-24">
                <div className="relative h-80">
                  <img 
                    src="/assets/mocha/chairman-ikd-west.jpg"
                    alt="Executive Chairman"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <Badge className="bg-secondary text-secondary-foreground mb-3">Executive Chairman</Badge>
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Hon. Otunba Suliamon Kazeem Olarewaju FCA, FCTI
                    </h2>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Term:</span>
                      <span className="ml-2 font-medium">2021 - Present</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Education:</span>
                      <span className="ml-2 font-medium">MBA, University of Lagos</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Previous Role:</span>
                      <span className="ml-2 font-medium">Commissioner, Lagos State</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <Button asChild className="w-full">
                      <Link to="/contact">
                        Contact the Chairman's Office
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message */}
            <div className="lg:col-span-3">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Welcome Message</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                From the Chairman's Desk
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  Dear Citizens of Ikorodu West,
                </p>
                <p className="leading-relaxed mb-6">
                  It is with great honor and humility that I serve as your Executive Chairman. Since assuming 
                  office, my administration has remained committed to our core mandate: bringing good governance 
                  closer to our people and transforming Ikorodu West into a model local government area.
                </p>
                <p className="leading-relaxed mb-6">
                  Our vision is clear — to build a prosperous Ikorodu West where every citizen has access to 
                  quality infrastructure, healthcare, education, and economic opportunities. We believe in 
                  governance that is transparent, accountable, and responsive to the needs of our people.
                </p>
                <p className="leading-relaxed mb-6">
                  Through various initiatives including our road rehabilitation program, youth empowerment 
                  schemes, healthcare revitalization, and this digital governance platform, we are working 
                  tirelessly to improve the quality of life for all residents.
                </p>
                <p className="leading-relaxed mb-6">
                  I invite you to explore this portal, engage with our services, and partner with us in 
                  building the Ikorodu West of our dreams. Your feedback and participation are essential 
                  to our success.
                </p>
                <p className="leading-relaxed font-medium text-foreground">
                  Together, we will achieve greatness.
                </p>
                <p className="mt-6">
                  <span className="font-semibold text-foreground">Hon. Otunba Suliamon Kazeem Olarewaju FCA, FCTI</span><br />
                  <span className="text-sm">Executive Chairman, Ikorodu West LCDA</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organogram */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Structure</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              LCDA Organogram
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lagos State Government Local Government/LCDA organizational structure showing the hierarchy of departments and units.
            </p>
          </div>

          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              <Organogram />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Media</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Photo Gallery
              </h2>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 gap-2">
              <ImageIcon className="w-4 h-4" />
              View All Photos
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer">
                <img 
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Records Archive */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Transparency</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Public Records Archive
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access official documents, reports, and public records in line with our commitment to transparent governance.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Records Table */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Document</th>
                    <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Category</th>
                    <th className="text-left p-4 font-medium text-sm hidden sm:table-cell">Date</th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Size</th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Downloads</th>
                    <th className="text-right p-4 font-medium text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{record.title}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant="outline">{record.category}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">
                        {new Date(record.date).toLocaleDateString('en-NG', { 
                          day: 'numeric',
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm hidden lg:table-cell">{record.size}</td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Download className="w-3.5 h-3.5" />
                          {record.downloads.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button size="sm" className="gap-1">
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Have a Question for the Chairman?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            We welcome your feedback, suggestions, and inquiries. Reach out to the Chairman's office 
            and our team will respond promptly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Link to="/contact">
                Send a Message
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link to="/services/request">
                Submit a Request
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
