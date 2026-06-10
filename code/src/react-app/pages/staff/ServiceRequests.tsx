import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Loader2,
  X,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';

interface ServiceRequest {
  id: number;
  tracking_number: string;
  service_type: string;
  citizen_name: string;
  citizen_email: string | null;
  citizen_phone: string;
  citizen_address: string | null;
  description: string | null;
  status: string;
  priority: string;
  department_id: number | null;
  department_name: string | null;
  assigned_to: number | null;
  assigned_to_name: string | null;
  notes: string | null;
  submitted_at: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  awaiting_documents: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  awaiting_documents: 'Awaiting Documents',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const serviceTypeLabels: Record<string, string> = {
  'birth-certificate': 'Birth Certificate',
  'marriage-certificate': 'Marriage Certificate',
  'death-certificate': 'Death Certificate',
  'primary-healthcare': 'Primary Healthcare',
  'business-permit': 'Business Permit',
  'building-approval': 'Building Approval',
  'waste-collection': 'Waste Collection',
  'drainage-complaint': 'Drainage Complaint',
  'general-inquiry': 'General Inquiry',
};

export default function ServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [staffNotes, setStaffNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/service-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string, notes?: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/service-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      
      if (response.ok) {
        await fetchRequests();
        if (selectedRequest?.id === id) {
          const updated = requests.find(r => r.id === id);
          if (updated) {
            setSelectedRequest({ ...updated, status, notes: notes || updated.notes });
          }
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.citizen_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    urgent: requests.filter(r => r.priority === 'urgent').length,
  };

  const openModal = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setStaffNotes(request.notes || '');
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/staff" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Service Requests</h1>
              <p className="text-sm text-gray-500">Manage citizen service requests</p>
            </div>
          </div>
          <Button onClick={fetchRequests} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
                  <p className="text-xs text-gray-500">Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by tracking number, name, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="awaiting_documents">Awaiting Documents</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tracking #</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Citizen</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Service</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Priority</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No service requests found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-green-600 font-medium">
                            {request.tracking_number}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{request.citizen_name}</p>
                            <p className="text-gray-500">{request.citizen_phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {serviceTypeLabels[request.service_type] || request.service_type}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={priorityColors[request.priority] || 'bg-gray-100 text-gray-800'}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[request.status] || 'bg-gray-100 text-gray-800'}>
                            {statusLabels[request.status] || request.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(request.submitted_at)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(request)}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{' '}
                  {filteredRequests.length} requests
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Request #{selectedRequest.tracking_number}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Submitted {formatDate(selectedRequest.submitted_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={statusColors[selectedRequest.status]}>
                  {statusLabels[selectedRequest.status]}
                </Badge>
                <Badge className={priorityColors[selectedRequest.priority]}>
                  {selectedRequest.priority.toUpperCase()}
                </Badge>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Service Info */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Service Requested</h3>
                <p className="text-lg font-medium text-green-700">
                  {serviceTypeLabels[selectedRequest.service_type] || selectedRequest.service_type}
                </p>
                {selectedRequest.description && (
                  <p className="mt-2 text-gray-600">{selectedRequest.description}</p>
                )}
              </div>

              {/* Citizen Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Citizen Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{selectedRequest.citizen_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedRequest.citizen_phone}
                    </p>
                  </div>
                  {selectedRequest.citizen_email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {selectedRequest.citizen_email}
                      </p>
                    </div>
                  )}
                  {selectedRequest.citizen_address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {selectedRequest.citizen_address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment Info */}
              <div className="grid grid-cols-2 gap-4">
                {selectedRequest.department_name && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      Assigned Department
                    </p>
                    <p className="font-medium text-gray-900">{selectedRequest.department_name}</p>
                  </div>
                )}
                {selectedRequest.assigned_to_name && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <UserCheck className="w-4 h-4" />
                      Assigned To
                    </p>
                    <p className="font-medium text-gray-900">{selectedRequest.assigned_to_name}</p>
                  </div>
                )}
              </div>

              {/* Staff Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Staff Notes
                </label>
                <textarea
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="Add notes about this request..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>

              {/* Resolution Info */}
              {selectedRequest.resolved_at && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Resolved on {formatDate(selectedRequest.resolved_at)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedRequest.status !== 'completed' && selectedRequest.status !== 'rejected' && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  {selectedRequest.status === 'pending' && (
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'in_progress', staffNotes)}
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Start Processing
                    </Button>
                  )}
                  {(selectedRequest.status === 'in_progress' || selectedRequest.status === 'awaiting_documents') && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(selectedRequest.id, 'awaiting_documents', staffNotes)}
                        disabled={actionLoading}
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Request Documents
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(selectedRequest.id, 'completed', staffNotes)}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        Mark Completed
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected', staffNotes)}
                    disabled={actionLoading}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
