import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  Building2,
  Users,
  FileText,
  Heart,
  GraduationCap,
  Leaf,
  Trash2,
  HandHeart,
  Wallet,
  MessageSquare,
  CheckCircle,
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon
const markerIcon = new L.Icon({
  iconUrl: '/assets/leaflet/marker-icon.png',
  iconRetinaUrl: '/assets/leaflet/marker-icon-2x.png',
  shadowUrl: '/assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const lcdaLocation: [number, number] = [6.6194, 3.5105];

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'LCDA Secretariat, Igbogbo-Bayeku Road, Ikorodu West, Lagos State, Nigeria',
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+234 812 345 6789',
    href: 'tel:+2348123456789',
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@ikoroduwestlcda.lg.gov.ng',
    href: 'mailto:info@ikoroduwestlcda.lg.gov.ng',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Monday - Friday: 8:00 AM - 4:00 PM',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50'
  }
];

const departments = [
  { name: 'Administration & HR', icon: Users, phone: '+234 812 345 6780', email: 'admin@ikoroduwestlcda.lg.gov.ng' },
  { name: 'Finance & Budget', icon: Wallet, phone: '+234 812 345 6781', email: 'finance@ikoroduwestlcda.lg.gov.ng' },
  { name: 'Works & Infrastructure', icon: Building2, phone: '+234 812 345 6782', email: 'works@ikoroduwestlcda.lg.gov.ng' },
  { name: 'Health Services', icon: Heart, phone: '+234 812 345 6783', email: 'health@ikoroduwestlcda.lg.gov.ng' },
  { name: 'Education', icon: GraduationCap, phone: '+234 812 345 6784', email: 'education@ikoroduwestlcda.lg.gov.ng' },
  { name: 'Agriculture', icon: Leaf, phone: '+234 812 345 6785', email: 'agric@ikoroduwestlcda.lg.gov.ng' },
  { name: 'Environment & Sanitation', icon: Trash2, phone: '+234 812 345 6786', email: 'environment@ikoroduwestlcda.lg.gov.ng' },
  { name: 'Social Welfare', icon: HandHeart, phone: '+234 812 345 6787', email: 'welfare@ikoroduwestlcda.lg.gov.ng' },
];

const inquiryTypes = [
  'General Inquiry',
  'Service Request',
  'Complaint',
  'Feedback/Suggestion',
  'Partnership Inquiry',
  'Media/Press',
  'Employment Inquiry',
  'Other'
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', inquiryType: '', subject: '', message: '' });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-green-700 to-green-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-6 px-4 py-1.5">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Contact Us
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We're here to serve you. Reach out with questions, feedback, or service requests. 
              Our team is committed to responding within 24-48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-20 relative z-20">
            {contactInfo.map((info, idx) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">{info.label}</h3>
                  {info.href ? (
                    <a href={info.href} className="text-foreground hover:text-primary transition-colors font-medium">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-foreground font-medium">{info.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {isSubmitted ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for contacting us. We've received your message and will respond within 24-48 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            required
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            placeholder="e.g., +234 812 345 6789"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Inquiry Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={formData.inquiryType}
                            onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                          >
                            <option value="">Select type...</option>
                            {inquiryTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <Input
                          required
                          placeholder="Brief description of your inquiry"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Please provide details about your inquiry..."
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Find Us
              </h2>
              <p className="text-muted-foreground mb-8">
                Visit our office or get directions to the LCDA Secretariat.
              </p>

              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-[300px] relative">
                  <MapContainer
                    center={lcdaLocation}
                    zoom={14}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={lcdaLocation} icon={markerIcon}>
                      <Popup>
                        <strong>Ikorodu West LCDA</strong><br />
                        Secretariat Building<br />
                        Igbogbo-Bayeku Road
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">LCDA Secretariat</h4>
                      <p className="text-sm text-muted-foreground">
                        Igbogbo-Bayeku Road, Ikorodu West, Lagos State
                      </p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${lcdaLocation[0]},${lcdaLocation[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2"
                      >
                        Get Directions
                        <FileText className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-0 shadow-lg mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Connect With Us</h3>
                  <div className="flex gap-3">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-sky-500 text-white rounded-xl flex items-center justify-center hover:bg-sky-600 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://youtube.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary mb-4">Direct Lines</Badge>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Department Contacts
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              For specific inquiries, reach out directly to the relevant department.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept, idx) => (
              <Card key={idx} className="border hover:border-primary/30 hover:shadow-lg transition-all group">
                <CardContent className="p-5">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <dept.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-3">{dept.name}</h3>
                  <div className="space-y-2">
                    <a 
                      href={`tel:${dept.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      {dept.phone}
                    </a>
                    <a 
                      href={`mailto:${dept.email}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors truncate"
                    >
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{dept.email}</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-red-50 border-y border-red-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Emergency Hotline</h3>
                <p className="text-muted-foreground text-sm">
                  For urgent matters requiring immediate attention
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="tel:+234800123456" 
                className="text-2xl md:text-3xl font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                +234 800 123 456
              </a>
              <Badge className="bg-red-500 text-white">24/7</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Have Questions?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Find answers to common questions about our services, processes, and requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              View FAQs
            </Button>
            <Button className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Start Live Chat
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
