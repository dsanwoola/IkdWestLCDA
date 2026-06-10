import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/lib/auth';
import { 
  Heart,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  X,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { Input } from '@/react-app/components/ui/input';

interface MarriageApplication {
  id: number;
  application_number: string;
  status: string;
  groom_surname: string;
  groom_first_name: string;
  groom_other_names: string | null;
  groom_dob: string;
  groom_place_of_birth: string | null;
  groom_occupation: string | null;
  groom_address: string;
  groom_phone: string;
  groom_email: string | null;
  groom_nationality: string;
  groom_state_of_origin: string | null;
  groom_lga: string | null;
  groom_marital_status: string | null;
  bride_surname: string;
  bride_first_name: string;
  bride_other_names: string | null;
  bride_dob: string;
  bride_place_of_birth: string | null;
  bride_occupation: string | null;
  bride_address: string;
  bride_phone: string;
  bride_email: string | null;
  bride_nationality: string;
  bride_state_of_origin: string | null;
  bride_lga: string | null;
  bride_marital_status: string | null;
  proposed_marriage_date: string | null;
  proposed_venue: string | null;
  marriage_type: string | null;
  witness1_name: string | null;
  witness1_phone: string | null;
  witness1_address: string | null;
  witness2_name: string | null;
  witness2_phone: string | null;
  witness2_address: string | null;
  fee_amount: number;
  fee_paid: number;
  payment_reference: string | null;
  payment_date: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: number | null;
  review_notes: string | null;
  approved_at: string | null;
  approved_by: number | null;
  certificate_number: string | null;
  certificate_issued_at: string | null;
  issued_by: number | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to get full name
const getGroomFullName = (app: MarriageApplication) => 
  [app.groom_first_name, app.groom_other_names, app.groom_surname].filter(Boolean).join(' ');

const getBrideFullName = (app: MarriageApplication) => 
  [app.bride_first_name, app.bride_other_names, app.bride_surname].filter(Boolean).join(' ');

const statusColors: Record<string, string> = {
  submitted: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  documents_requested: 'bg-orange-100 text-orange-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  certificate_issued: 'bg-emerald-100 text-emerald-800',
};

const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  documents_requested: 'Documents Requested',
  approved: 'Approved',
  rejected: 'Rejected',
  certificate_issued: 'Certificate Issued',
};

export default function MarriageApplicationsPage() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [applications, setApplications] = useState<MarriageApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<MarriageApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/staff/login');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/marriage-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string, reason?: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/marriage-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          rejection_reason: reason,
          review_notes: reason
        }),
      });
      
      if (response.ok) {
        await fetchApplications();
        setShowModal(false);
        setSelectedApplication(null);
        setShowRejectionForm(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const groomName = getGroomFullName(app).toLowerCase();
    const brideName = getBrideFullName(app).toLowerCase();
    const matchesSearch = 
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groomName.includes(searchTerm.toLowerCase()) ||
      brideName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'submitted').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved' || a.status === 'certificate_issued').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/staff" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-500" />
                <h1 className="text-xl font-bold text-gray-900">Marriage Applications</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Pending</p>
                  <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Under Review</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.underReview}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Approved</p>
                  <p className="text-2xl font-bold text-green-800">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Rejected</p>
                  <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by tracking ID or names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="documents_requested">Documents Requested</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="certificate_issued">Certificate Issued</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedApplications.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No marriage applications found</p>
                <p className="text-sm text-gray-400 mt-1">Applications submitted by citizens will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tracking ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Couple</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Marriage Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Submitted</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedApplications.map((app) => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-green-600 font-medium">
                            {app.application_number}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{getGroomFullName(app)}</p>
                            <p className="text-gray-500">& {getBrideFullName(app)}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {app.proposed_marriage_date ? formatDate(app.proposed_marriage_date) : 'TBD'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm capitalize text-gray-600">
                            {app.marriage_type || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[app.status] || 'bg-gray-100 text-gray-800'}>
                            {statusLabels[app.status] || app.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={app.fee_paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {app.fee_paid ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(app.submitted_at || app.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-pink-500" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Application #{selectedApplication.application_number}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(selectedApplication.submitted_at || selectedApplication.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApplication(null);
                  setShowRejectionForm(false);
                  setRejectionReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`rounded-lg p-4 flex items-center justify-between ${
                selectedApplication.status === 'rejected' ? 'bg-red-50' :
                selectedApplication.status === 'approved' || selectedApplication.status === 'certificate_issued' ? 'bg-green-50' :
                'bg-blue-50'
              }`}>
                <div className="flex items-center gap-3">
                  {selectedApplication.status === 'rejected' ? (
                    <XCircle className="w-6 h-6 text-red-500" />
                  ) : selectedApplication.status === 'approved' || selectedApplication.status === 'certificate_issued' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Clock className="w-6 h-6 text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      Status: {statusLabels[selectedApplication.status]}
                    </p>
                    {selectedApplication.rejection_reason && (
                      <p className="text-sm text-red-600 mt-1">
                        Reason: {selectedApplication.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={selectedApplication.fee_paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {selectedApplication.fee_paid ? `₦${selectedApplication.fee_amount?.toLocaleString()} Paid` : 'Payment Pending'}
                </Badge>
              </div>

              {/* Groom Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Groom's Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{getGroomFullName(selectedApplication)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth / Age</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedApplication.groom_dob)} ({calculateAge(selectedApplication.groom_dob)} years)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Occupation</p>
                    <p className="font-medium text-gray-900">{selectedApplication.groom_occupation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedApplication.groom_phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedApplication.groom_email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedApplication.groom_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-medium text-gray-900">{selectedApplication.groom_state_of_origin || 'N/A'}, {selectedApplication.groom_lga || ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marital Status</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedApplication.groom_marital_status || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Bride Information */}
              <div className="bg-pink-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-500" />
                  Bride's Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{getBrideFullName(selectedApplication)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth / Age</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedApplication.bride_dob)} ({calculateAge(selectedApplication.bride_dob)} years)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Occupation</p>
                    <p className="font-medium text-gray-900">{selectedApplication.bride_occupation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedApplication.bride_phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedApplication.bride_email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedApplication.bride_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-medium text-gray-900">{selectedApplication.bride_state_of_origin || 'N/A'}, {selectedApplication.bride_lga || ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marital Status</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedApplication.bride_marital_status || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Marriage Details */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Marriage Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Proposed Date</p>
                    <p className="font-medium text-gray-900">{selectedApplication.proposed_marriage_date ? formatDate(selectedApplication.proposed_marriage_date) : 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marriage Type</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedApplication.marriage_type || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-medium text-gray-900">{selectedApplication.proposed_venue || 'TBD'}</p>
                  </div>
                </div>
              </div>

              {/* Witnesses */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Witness 1</h4>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedApplication.witness1_name || 'N/A'}</span></p>
                    <p className="text-sm"><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedApplication.witness1_phone || 'N/A'}</span></p>
                    <p className="text-sm"><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedApplication.witness1_address || 'N/A'}</span></p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Witness 2</h4>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedApplication.witness2_name || 'N/A'}</span></p>
                    <p className="text-sm"><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedApplication.witness2_phone || 'N/A'}</span></p>
                    <p className="text-sm"><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedApplication.witness2_address || 'N/A'}</span></p>
                  </div>
                </div>
              </div>

              {/* Processing Info */}
              {selectedApplication.reviewed_by && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Reviewed on {selectedApplication.reviewed_at ? formatDate(selectedApplication.reviewed_at) : 'N/A'}
                  </p>
                  {selectedApplication.review_notes && (
                    <p className="text-sm text-gray-600 mt-1">Notes: {selectedApplication.review_notes}</p>
                  )}
                  {selectedApplication.certificate_number && (
                    <p className="text-sm text-green-600 mt-1">
                      Certificate Number: <span className="font-mono font-bold">{selectedApplication.certificate_number}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Rejection Form */}
              {showRejectionForm && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Rejection Reason
                  </h4>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    className="w-full border border-red-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected', rejectionReason)}
                      disabled={!rejectionReason.trim() || actionLoading}
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                      Confirm Rejection
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectionForm(false);
                        setRejectionReason('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!showRejectionForm && selectedApplication.status !== 'rejected' && selectedApplication.status !== 'certificate_issued' && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  {selectedApplication.status === 'submitted' && (
                    <Button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'under_review')}
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      Start Review
                    </Button>
                  )}
                  {(selectedApplication.status === 'under_review' || selectedApplication.status === 'documents_requested') && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'documents_requested')}
                        disabled={actionLoading}
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Request Documents
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                        disabled={actionLoading || !selectedApplication.fee_paid}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        Approve Application
                      </Button>
                    </>
                  )}
                  {selectedApplication.status === 'approved' && (
                    <Button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'certificate_issued')}
                      disabled={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                      Issue Certificate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectionForm(true)}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {!selectedApplication.fee_paid && selectedApplication.status !== 'rejected' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Payment is pending. Approval requires payment confirmation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
