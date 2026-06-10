import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { 
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  ClipboardList,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Label } from '@/react-app/components/ui/label';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';

const serviceCategories: Record<string, string> = {
  'civil-registration': 'Civil Registration',
  'health-services': 'Health Services',
  'social-welfare': 'Social Welfare',
  'works-planning': 'Works & Planning',
  'education': 'Education',
  'agriculture': 'Agriculture',
  'environment': 'Environment & Sanitation',
  'business': 'Trade & Business',
};

interface StatusHistoryItem {
  id: number;
  old_status: string | null;
  new_status: string;
  notes: string | null;
  changed_by_name: string | null;
  created_at: string;
}

interface TrackedRequest {
  tracking_number: string;
  service_type: string;
  status: string;
  priority: string;
  submitted_at: string;
  resolved_at: string | null;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: 'Pending Review', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: RefreshCw },
  awaiting_documents: { label: 'Awaiting Documents', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: FileText },
  completed: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100', icon: AlertCircle },
  cancelled: { label: 'Cancelled', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: AlertCircle },
};

export default function TrackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTracking = searchParams.get('id') || '';
  
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [isTracking, setIsTracking] = useState(false);
  const [trackedRequest, setTrackedRequest] = useState<TrackedRequest | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleTrack = useCallback(async (trackingId?: string) => {
    const idToTrack = trackingId || trackingNumber.trim();
    setTrackError(null);
    setTrackedRequest(null);
    setStatusHistory([]);
    
    if (!idToTrack) {
      setTrackError('Please enter a tracking number');
      return;
    }
    
    setIsTracking(true);
    
    try {
      const response = await fetch(`/api/service-requests/track/${encodeURIComponent(idToTrack)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request not found');
      }
      
      setTrackedRequest(data.request);
      setStatusHistory(data.history || []);
      setSearchParams({ id: idToTrack });
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : 'Request not found');
    } finally {
      setIsTracking(false);
    }
  }, [setSearchParams, trackingNumber]);

  useEffect(() => {
    if (initialTracking) {
      void handleTrack(initialTracking);
    }
  }, [handleTrack, initialTracking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleTrack();
  };

  const status = trackedRequest ? statusConfig[trackedRequest.status] || statusConfig.pending : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    return statusConfig[status]?.label || status;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Track Request</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Track Your Request
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
            Enter your tracking number to see the current status and full history 
            of your service request.
          </p>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          {/* Search Card */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Enter Tracking Number
                  </h2>
                  <p className="text-sm text-muted-foreground">Format: SR-2024-XXXXXX</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tracking" className="sr-only">Tracking Number</Label>
                  <div className="flex gap-3">
                    <Input
                      id="tracking"
                      placeholder="e.g., SR-2024-ABC123"
                      value={trackingNumber}
                      onChange={(e) => {
                        setTrackingNumber(e.target.value);
                        setTrackError(null);
                      }}
                      className="font-mono text-lg h-12"
                    />
                    <Button type="submit" size="lg" disabled={isTracking} className="gap-2 px-6">
                      {isTracking ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
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
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
              {/* Status Overview */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className={`${status.bgColor} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <status.icon className={`w-6 h-6 ${status.color}`} />
                      <span className={`font-semibold text-lg ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {trackedRequest.tracking_number}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <ClipboardList className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Service Type</div>
                        <div className="font-medium">
                          {serviceCategories[trackedRequest.service_type] || trackedRequest.service_type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Priority</div>
                        <div className="font-medium capitalize">{trackedRequest.priority}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Submitted</div>
                        <div className="font-medium">{formatDate(trackedRequest.submitted_at)}</div>
                      </div>
                    </div>
                    {trackedRequest.resolved_at && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">Resolved</div>
                          <div className="font-medium">{formatDate(trackedRequest.resolved_at)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Status History
                  </h3>
                  
                  {statusHistory.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200" />
                      <div className="space-y-6">
                        {statusHistory.map((item, idx) => {
                          const itemStatus = statusConfig[item.new_status] || statusConfig.pending;
                          const isLatest = idx === statusHistory.length - 1;
                          
                          return (
                            <div key={item.id} className="relative flex gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                isLatest 
                                  ? 'bg-primary text-white ring-4 ring-primary/20' 
                                  : 'bg-white border-2 border-gray-300'
                              }`}>
                                <itemStatus.icon className={`w-4 h-4 ${isLatest ? '' : 'text-gray-400'}`} />
                              </div>
                              <div className="flex-1 pb-2">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className={`font-medium ${isLatest ? 'text-primary' : ''}`}>
                                      {getStatusLabel(item.new_status)}
                                    </div>
                                    {item.notes && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {item.notes}
                                      </p>
                                    )}
                                    {item.changed_by_name && (
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                        <User className="w-3 h-3" />
                                        {item.changed_by_name}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDate(item.created_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p>No status updates recorded yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Next Steps */}
              {trackedRequest.status === 'awaiting_documents' && (
                <Card className="border-0 shadow-md bg-amber-50 border-amber-200">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <FileText className="w-6 h-6 text-amber-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-amber-800 mb-2">Action Required</h3>
                        <p className="text-sm text-amber-700 mb-3">
                          We need additional documents to process your request. Please visit 
                          the LCDA Secretariat with the required documents or contact us for more information.
                        </p>
                        <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                          <Link to="/contact">Contact Us</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Help Section */}
          <Card className="border-0 shadow-md bg-muted/50 mt-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you can't find your tracking number or have questions about your request, 
                    please contact our helpdesk.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a href="tel:+2341234567890" className="flex items-center gap-2 text-primary hover:underline">
                      <Phone className="w-4 h-4" />
                      +234 123 456 7890
                    </a>
                    <a href="mailto:services@ikoroduwest.lg.gov.ng" className="flex items-center gap-2 text-primary hover:underline">
                      <Mail className="w-4 h-4" />
                      services@ikoroduwest.lg.gov.ng
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link 
              to="/services/request" 
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group flex-1"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="font-medium">Submit New Request</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link 
              to="/services" 
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group flex-1"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium">Browse All Services</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
