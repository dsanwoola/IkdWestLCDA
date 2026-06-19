import { useState } from 'react';
import { Link } from 'react-router';
import { 
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
  Send,
  AlertCircle,
  Copy,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  User,
  Loader2,
  ClipboardList,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Label } from '@/react-app/components/ui/label';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';

const serviceCategories = [
  { id: 'civil-registration', name: 'Civil Registration', icon: FileText, description: 'Birth, death certificates & records' },
  { id: 'health-services', name: 'Health Services', icon: Heart, description: 'Primary healthcare & immunization' },
  { id: 'social-welfare', name: 'Social Welfare', icon: Users, description: 'Support for vulnerable groups' },
  { id: 'works-planning', name: 'Works & Planning', icon: Building2, description: 'Building approvals & permits' },
  { id: 'education', name: 'Education', icon: GraduationCap, description: 'Educational support & scholarships' },
  { id: 'agriculture', name: 'Agriculture', icon: Leaf, description: 'Farming support & inputs' },
  { id: 'environment', name: 'Environment & Sanitation', icon: Trash2, description: 'Waste management & sanitation' },
  { id: 'business', name: 'Trade & Business', icon: Briefcase, description: 'Business registration & permits' },
];

interface TrackedRequest {
  tracking_number: string;
  service_type: string;
  status: string;
  priority: string;
  submitted_at: string;
  resolved_at: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-800', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  awaiting_info: { label: 'Awaiting Information', color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
};

export default function ServiceRequestPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  
  // Form state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_email: '',
    citizen_phone: '',
    citizen_address: '',
    description: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Track state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedRequest, setTrackedRequest] = useState<TrackedRequest | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!selectedCategory) {
      setSubmitError('Please select a service category');
      return;
    }
    
    if (!formData.citizen_name.trim()) {
      setSubmitError('Please enter your full name');
      return;
    }
    
    if (!formData.citizen_phone.trim()) {
      setSubmitError('Please enter your phone number');
      return;
    }
    
    if (!formData.description.trim()) {
      setSubmitError('Please describe your request');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: selectedCategory,
          ...formData
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }
      
      setSubmitSuccess(data.tracking_number);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    setTrackedRequest(null);
    
    if (!trackingNumber.trim()) {
      setTrackError('Please enter a tracking number');
      return;
    }
    
    setIsTracking(true);
    
    try {
      const response = await fetch(`/api/service-requests/track/${encodeURIComponent(trackingNumber.trim())}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request not found');
      }
      
      setTrackedRequest(data.request);
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : 'Request not found');
    } finally {
      setIsTracking(false);
    }
  };

  const copyTrackingNumber = () => {
    if (submitSuccess) {
      navigator.clipboard.writeText(submitSuccess);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setFormData({
      citizen_name: '',
      citizen_email: '',
      citizen_phone: '',
      citizen_address: '',
      description: '',
      priority: 'normal'
    });
    setSubmitSuccess(null);
    setSubmitError(null);
  };

  const getCategoryName = (id: string) => {
    const cat = serviceCategories.find(c => c.id === id);
    return cat?.name || id;
  };

  const status = trackedRequest ? statusConfig[trackedRequest.status] || statusConfig.pending : null;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-10 text-white sm:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white">Submit Request</span>
          </nav>
          <h1 className="mb-4 text-balance text-3xl font-bold sm:text-4xl md:text-5xl" style={{ fontFamily: 'Playfair Display, serif' }}>
            Service Request Portal
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/80 sm:text-xl">
            Submit your service request online and track its progress. Our team will 
            review and respond within 3-5 business days.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-20 border-b bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-2">
            <button
              onClick={() => setActiveTab('submit')}
              className={`min-h-12 px-2 py-3 text-center text-sm font-medium border-b-2 transition-colors sm:py-4 sm:text-base ${
                activeTab === 'submit'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Send className="mr-1 inline-block h-4 w-4 sm:mr-2" />
              <span className="hidden min-[380px]:inline">Submit New </span>Request
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`min-h-12 px-2 py-3 text-center text-sm font-medium border-b-2 transition-colors sm:py-4 sm:text-base ${
                activeTab === 'track'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Search className="mr-1 inline-block h-4 w-4 sm:mr-2" />
              Track Request
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-muted/30 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {activeTab === 'submit' ? (
            submitSuccess ? (
              // Success State
              <Card className="border-0 shadow-lg">
                <CardContent className="p-5 text-center sm:p-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Request Submitted Successfully!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your service request has been received. Please save your tracking number 
                    to check the status of your request.
                  </p>
                  
                  <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-6">
                    <div className="text-sm text-muted-foreground mb-2">Your Tracking Number</div>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <span className="break-all font-mono text-xl font-bold text-primary sm:text-2xl">{submitSuccess}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyTrackingNumber}
                        className="gap-2"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-800">Important</p>
                      <p className="text-amber-700">
                        Keep this tracking number safe. You'll need it to check the status of your request 
                        and for any follow-up communications.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Another Request
                    </Button>
                    <Button
                      onClick={() => {
                        setTrackingNumber(submitSuccess);
                        setActiveTab('track');
                      }}
                      className="gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Track This Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Submit Form
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Submit Service Request
                      </h2>
                      <p className="text-sm text-muted-foreground">Fill in the details below</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Category */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        What service do you need? <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 md:grid-cols-4">
                        {serviceCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`min-h-24 rounded-xl border-2 p-3 text-left transition-all ${
                              selectedCategory === category.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <category.icon className={`w-6 h-6 mb-2 ${
                              selectedCategory === category.id ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                            <div className={`text-sm font-medium ${
                              selectedCategory === category.id ? 'text-primary' : ''
                            }`}>
                              {category.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Your Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={formData.citizen_name}
                            onChange={(e) => handleInputChange('citizen_name', e.target.value)}
                            className="mt-1 h-12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                          <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              placeholder="08012345678"
                              value={formData.citizen_phone}
                              onChange={(e) => handleInputChange('citizen_phone', e.target.value)}
                              className="h-12 pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com (optional)"
                              value={formData.citizen_email}
                              onChange={(e) => handleInputChange('citizen_email', e.target.value)}
                              className="h-12 pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="address"
                              placeholder="Your residential address"
                              value={formData.citizen_address}
                              onChange={(e) => handleInputChange('citizen_address', e.target.value)}
                              className="h-12 pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Request Details
                      </h3>
                      <div>
                        <Label htmlFor="description">
                          Describe your request <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Please provide details about your service request. Include any relevant information that will help us process your request faster."
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="mt-1 min-h-[140px]"
                        />
                      </div>
                      
                      <div className="mt-4">
                        <Label>Priority Level</Label>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                          {[
                            { value: 'normal', label: 'Normal', desc: 'Standard processing' },
                            { value: 'high', label: 'Urgent', desc: 'Expedited review' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleInputChange('priority', option.value)}
                              className={`min-h-20 rounded-lg border-2 p-3 text-left transition-all ${
                                formData.priority === option.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className={`font-medium ${
                                formData.priority === option.value ? 'text-primary' : ''
                              }`}>
                                {option.label}
                              </div>
                              <div className="text-xs text-muted-foreground">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )
          ) : (
            // Track Tab
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Track Your Request
                      </h2>
                      <p className="text-sm text-muted-foreground">Enter your tracking number to check status</p>
                    </div>
                  </div>

                  <form onSubmit={handleTrack} className="space-y-4">
                    <div>
                      <Label htmlFor="tracking">Tracking Number</Label>
                      <div className="flex gap-3 mt-1">
                        <Input
                          id="tracking"
                          placeholder="e.g., SR-2024-ABC123"
                          value={trackingNumber}
                          onChange={(e) => {
                            setTrackingNumber(e.target.value);
                            setTrackError(null);
                          }}
                          className="font-mono"
                        />
                        <Button type="submit" disabled={isTracking} className="gap-2">
                          {isTracking ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                          Track
                        </Button>
                      </div>
                    </div>

                    {trackError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-red-800">Request not found</p>
                          <p className="text-red-700">
                            Please check your tracking number and try again. If you just submitted 
                            a request, it may take a few moments to appear.
                          </p>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Tracked Request Result */}
              {trackedRequest && status && (
                <Card className="border-0 shadow-lg animate-in fade-in slide-in-from-top-4">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Tracking Number</div>
                        <div className="font-mono font-bold text-lg">{trackedRequest.tracking_number}</div>
                      </div>
                      <Badge className={status.color}>
                        <status.icon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Service Type</div>
                        <div className="font-medium">{getCategoryName(trackedRequest.service_type)}</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Priority</div>
                        <div className="font-medium capitalize">{trackedRequest.priority}</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Submitted</div>
                        <div className="font-medium">
                          {new Date(trackedRequest.submitted_at).toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      {trackedRequest.resolved_at && (
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="text-sm text-muted-foreground mb-1">Resolved</div>
                          <div className="font-medium">
                            {new Date(trackedRequest.resolved_at).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Timeline */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Request Progress</h3>
                      <div className="relative">
                        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200" />
                        {[
                          { status: 'pending', label: 'Request Submitted', desc: 'Your request has been received' },
                          { status: 'in_progress', label: 'Under Review', desc: 'Our team is processing your request' },
                          { status: 'resolved', label: 'Completed', desc: 'Your request has been resolved' }
                        ].map((step, idx) => {
                          const statusOrder = ['pending', 'in_progress', 'resolved'];
                          const currentIdx = statusOrder.indexOf(trackedRequest.status);
                          const stepIdx = statusOrder.indexOf(step.status);
                          const isComplete = stepIdx <= currentIdx;
                          const isCurrent = stepIdx === currentIdx;
                          
                          return (
                            <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                isComplete 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-200 text-gray-400'
                              } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <div className="flex-1 pt-1">
                                <div className={`font-medium ${isComplete ? '' : 'text-muted-foreground'}`}>
                                  {step.label}
                                </div>
                                <div className="text-sm text-muted-foreground">{step.desc}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help Section */}
              <Card className="border-0 shadow-md bg-amber-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">Need Help?</h3>
                      <p className="text-sm text-amber-700 mb-3">
                        If you can't find your tracking number or have questions about your request, 
                        please contact our helpdesk.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <a href="tel:+2341234567890" className="flex items-center gap-2 text-amber-800 hover:underline">
                          <Phone className="w-4 h-4" />
                          +234 123 456 7890
                        </a>
                        <a href="mailto:services@ikoroduwest.lg.gov.ng" className="flex items-center gap-2 text-amber-800 hover:underline">
                          <Mail className="w-4 h-4" />
                          services@ikoroduwest.lg.gov.ng
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="font-semibold mb-4">Related Services</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link 
              to="/services" 
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="font-medium">Browse All Services</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link 
              to="/services/marriage-certificate" 
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-primary" />
                <span className="font-medium">Marriage Certificate</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
