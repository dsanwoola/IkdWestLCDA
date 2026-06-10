import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowRight, 
  FileText,
  Heart,
  Users,
  Building2,
  GraduationCap,
  Leaf,
  Trash2,
  Briefcase,
  Clock,
  CheckCircle,
  Search,
  ChevronRight,
  Phone,
  MapPin,
  ClipboardList,
  BadgeCheck,
  AlertCircle,
  Download
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';

const serviceCategories = [
  {
    id: 'civil-registration',
    name: 'Civil Registration',
    icon: FileText,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    description: 'Birth, death, and marriage certificates',
    services: [
      {
        name: 'Birth Certificate Registration',
        description: 'Register births and obtain birth certificates for newborns and late registrations.',
        requirements: ['Hospital birth notification', 'Parents\' valid ID', 'Passport photographs', 'Immunization card'],
        processingTime: '3-5 working days',
        fee: '₦5,000',
        popular: true
      },
      {
        name: 'Marriage Certificate',
        description: 'Legal marriage registration and certificate issuance under the Marriage Act.',
        requirements: ['Birth certificates of both parties', 'Valid IDs', 'Passport photographs', 'Sworn affidavit of bachelorhood/spinsterhood'],
        processingTime: '21 days (statutory notice period)',
        fee: '₦25,000',
        popular: true
      },
      {
        name: 'Death Certificate',
        description: 'Register deaths and obtain death certificates for deceased persons.',
        requirements: ['Medical certificate of cause of death', 'Deceased\'s ID', 'Informant\'s valid ID'],
        processingTime: '3-5 working days',
        fee: '₦3,000'
      }
    ]
  },
  {
    id: 'health-services',
    name: 'Health Services',
    icon: Heart,
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    description: 'Primary healthcare and immunization',
    services: [
      {
        name: 'Primary Health Care',
        description: 'Access basic healthcare services at our primary health centers.',
        requirements: ['Valid ID or residence proof', 'Health card (if available)'],
        processingTime: 'Same day',
        fee: 'Subsidized rates',
        popular: true
      },
      {
        name: 'Child Immunization',
        description: 'Free routine immunization for children under 5 years.',
        requirements: ['Birth certificate', 'Immunization card', 'Parent/guardian ID'],
        processingTime: 'Same day',
        fee: 'Free'
      },
      {
        name: 'Antenatal Care',
        description: 'Prenatal care services for expectant mothers.',
        requirements: ['Pregnancy test result', 'Valid ID'],
        processingTime: 'Same day',
        fee: 'Subsidized rates'
      }
    ]
  },
  {
    id: 'social-welfare',
    name: 'Social Welfare',
    icon: Users,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    description: 'Support for vulnerable groups',
    services: [
      {
        name: 'Widow Support Program',
        description: 'Financial assistance and empowerment programs for widows.',
        requirements: ['Death certificate of spouse', 'Valid ID', 'Proof of residence', 'Recommendation letter from community leader'],
        processingTime: '2-3 weeks',
        fee: 'Free'
      },
      {
        name: 'Disability Support',
        description: 'Assistive devices and support programs for persons with disabilities.',
        requirements: ['Medical assessment report', 'Valid ID', 'Passport photograph'],
        processingTime: '2-4 weeks',
        fee: 'Free'
      },
      {
        name: 'Youth Empowerment',
        description: 'Skills acquisition and entrepreneurship programs for youth.',
        requirements: ['Valid ID (18-35 years)', 'Educational certificates', 'Passport photographs'],
        processingTime: 'Based on program cycles',
        fee: 'Free',
        popular: true
      }
    ]
  },
  {
    id: 'works-planning',
    name: 'Works & Planning',
    icon: Building2,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    description: 'Building approvals and permits',
    services: [
      {
        name: 'Building Plan Approval',
        description: 'Approval for residential and commercial building plans.',
        requirements: ['Survey plan', 'Architectural drawings', 'Structural drawings', 'Land ownership documents'],
        processingTime: '2-4 weeks',
        fee: 'Based on building size'
      },
      {
        name: 'Signage Permit',
        description: 'Permits for business signage and outdoor advertising.',
        requirements: ['Business registration', 'Signage design', 'Property owner consent'],
        processingTime: '1-2 weeks',
        fee: '₦15,000 - ₦50,000'
      },
      {
        name: 'Road Closure Permit',
        description: 'Temporary road closure for events or construction.',
        requirements: ['Application letter', 'Event details', 'Traffic management plan'],
        processingTime: '1 week',
        fee: '₦20,000'
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50',
    description: 'Educational support and scholarships',
    services: [
      {
        name: 'School Enrollment Assistance',
        description: 'Support for enrolling children in public schools.',
        requirements: ['Birth certificate', 'Parent/guardian ID', 'Proof of residence'],
        processingTime: 'Based on school calendar',
        fee: 'Free'
      },
      {
        name: 'Scholarship Application',
        description: 'Merit-based and need-based scholarships for indigent students.',
        requirements: ['Academic records', 'Recommendation letters', 'Income proof', 'Valid ID'],
        processingTime: '4-6 weeks',
        fee: 'Free',
        popular: true
      }
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: Leaf,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    description: 'Farming support and inputs',
    services: [
      {
        name: 'Agricultural Input Distribution',
        description: 'Subsidized seeds, fertilizers, and farming equipment.',
        requirements: ['Farmer registration', 'Valid ID', 'Proof of farm ownership/lease'],
        processingTime: 'Seasonal distribution',
        fee: 'Subsidized rates'
      },
      {
        name: 'Extension Services',
        description: 'Training and technical support for farmers.',
        requirements: ['Farmer registration'],
        processingTime: 'Ongoing',
        fee: 'Free'
      }
    ]
  },
  {
    id: 'environment',
    name: 'Environment & Sanitation',
    icon: Trash2,
    color: 'bg-teal-500',
    lightColor: 'bg-teal-50',
    description: 'Waste management and sanitation',
    services: [
      {
        name: 'Waste Collection Service',
        description: 'Regular waste collection for residential and commercial properties.',
        requirements: ['Property address registration'],
        processingTime: 'Weekly collection',
        fee: '₦2,000/month (residential)'
      },
      {
        name: 'Drainage Clearance Request',
        description: 'Report and request clearance of blocked drainages.',
        requirements: ['Location details', 'Photos (optional)'],
        processingTime: '3-7 working days',
        fee: 'Free'
      }
    ]
  },
  {
    id: 'business',
    name: 'Trade & Business',
    icon: Briefcase,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    description: 'Business registration and permits',
    services: [
      {
        name: 'Trade Permit',
        description: 'Operating permits for businesses within the LCDA.',
        requirements: ['CAC registration', 'Shop/office address', 'Passport photograph'],
        processingTime: '1-2 weeks',
        fee: '₦10,000 - ₦50,000'
      },
      {
        name: 'Market Stall Allocation',
        description: 'Allocation of stalls in LCDA markets.',
        requirements: ['Valid ID', 'Trade association membership', 'Application form'],
        processingTime: 'Subject to availability',
        fee: 'Based on location'
      }
    ]
  }
];

const popularServices = serviceCategories.flatMap(cat => 
  cat.services.filter(s => s.popular).map(s => ({ ...s, category: cat.name, categoryColor: cat.color }))
);

const processSteps = [
  { step: 1, title: 'Submit Application', description: 'Fill out the online form or visit our office', icon: ClipboardList },
  { step: 2, title: 'Document Verification', description: 'Our team reviews your documents', icon: Search },
  { step: 3, title: 'Processing', description: 'Application is processed by relevant department', icon: Clock },
  { step: 4, title: 'Approval & Collection', description: 'Collect your certificate/permit', icon: BadgeCheck }
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const filteredCategories = serviceCategories.filter(cat => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return cat.name.toLowerCase().includes(query) || 
           cat.description.toLowerCase().includes(query) ||
           cat.services.some(s => s.name.toLowerCase().includes(query));
  });

  const activeCategory = selectedCategory 
    ? serviceCategories.find(c => c.id === selectedCategory) 
    : null;

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
            <span className="text-white">Services</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Government Services
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl mb-8">
            Access essential government services from Ikorodu West LCDA. We're committed 
            to serving you efficiently and transparently.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-white text-gray-900 border-0 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Popular Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.map((service, idx) => (
              <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-5">
                  <Badge className={`mb-3 ${service.categoryColor} text-white`}>
                    {service.category}
                  </Badge>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {service.processingTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Browse By Category</span>
            <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Service Categories
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredCategories.map((category) => (
              <Card 
                key={category.id}
                className={`border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group ${
                  selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.lightColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className={`w-8 h-8 ${category.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <Badge variant="secondary">
                    {category.services.length} services
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Category Services */}
          {activeCategory && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <div className={`w-10 h-10 ${activeCategory.color} rounded-xl flex items-center justify-center`}>
                    <activeCategory.icon className="w-5 h-5 text-white" />
                  </div>
                  {activeCategory.name}
                </h3>
                <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
                  Clear Selection
                </Button>
              </div>

              <div className="space-y-4">
                {activeCategory.services.map((service, idx) => (
                  <Card key={idx} className="border-0 shadow-md">
                    <CardContent className="p-0">
                      <button
                        className="w-full p-6 text-left flex items-center justify-between"
                        onClick={() => setExpandedService(
                          expandedService === `${activeCategory.id}-${idx}` ? null : `${activeCategory.id}-${idx}`
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{service.name}</h4>
                            {service.popular && (
                              <Badge className="bg-secondary text-secondary-foreground">Popular</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{service.description}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                          expandedService === `${activeCategory.id}-${idx}` ? 'rotate-90' : ''
                        }`} />
                      </button>

                      {expandedService === `${activeCategory.id}-${idx}` && (
                        <div className="px-6 pb-6 pt-2 border-t bg-muted/30 animate-in fade-in slide-in-from-top-2">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold mb-3 flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-primary" />
                                Requirements
                              </h5>
                              <ul className="space-y-2">
                                {service.requirements.map((req, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <span className="text-sm text-muted-foreground">Processing Time</span>
                                <span className="font-semibold flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-primary" />
                                  {service.processingTime}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <span className="text-sm text-muted-foreground">Fee</span>
                                <span className="font-semibold text-primary">{service.fee}</span>
                              </div>
                              <Button className="w-full gap-2">
                                Apply for this Service
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No services found</h3>
              <p className="text-muted-foreground">
                Try a different search term or browse by category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              How to Access Services
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <Card className="border-0 shadow-md h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {step.step}
                    </div>
                    <step.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Request Tracking */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Track Your Request</span>
              <h2 className="text-3xl font-bold mt-2 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Check Application Status
              </h2>
              <p className="text-muted-foreground mb-6">
                Already submitted an application? Track its progress using your tracking number. 
                You'll receive updates via SMS and email as your application moves through the process.
              </p>
              
              <div className="flex gap-3">
                <Input 
                  placeholder="Enter tracking number (e.g., IKW-2024-00123)"
                  className="flex-1"
                />
                <Button className="gap-2">
                  Track
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800">Can't find your tracking number?</p>
                  <p className="text-amber-700">
                    Check your SMS or email, or contact our helpdesk at <span className="font-semibold">+234 123 456 7890</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-muted-foreground">Completed This Month</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">3.2</div>
                  <div className="text-sm text-muted-foreground">Avg. Days to Complete</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md col-span-2">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Download Forms</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm">Birth Registration Form</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm">Marriage Notice Form</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm">Service Request Form</span>
                      <Download className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Need Help with a Service?
              </h2>
              <p className="text-white/80 mb-6">
                Our customer service team is ready to assist you with any questions about 
                our services, requirements, or application process.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/contact">
                    Report an Issue
                  </Link>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg">
                <Phone className="w-6 h-6" />
                <div>
                  <div className="text-sm text-white/70">Helpline</div>
                  <div className="font-semibold">+234 123 456 7890</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg">
                <MapPin className="w-6 h-6" />
                <div>
                  <div className="text-sm text-white/70">Service Center</div>
                  <div className="font-semibold">LCDA Secretariat, Ikorodu</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg">
                <Clock className="w-6 h-6" />
                <div>
                  <div className="text-sm text-white/70">Working Hours</div>
                  <div className="font-semibold">Mon - Fri: 8AM - 4PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
