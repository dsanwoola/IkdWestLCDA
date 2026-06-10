import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/react-app/lib/auth";
import HomePage from "@/react-app/pages/Home";
import AboutPage from "@/react-app/pages/About";
import ChairmanOfficePage from "@/react-app/pages/ChairmanOffice";
import DepartmentsPage from "@/react-app/pages/Departments";
import NewsPage from "@/react-app/pages/News";
import ProjectsPage from "@/react-app/pages/Projects";
import ServicesPage from "@/react-app/pages/Services";
import TourismPage from "@/react-app/pages/Tourism";
import BudgetPage from "@/react-app/pages/Budget";
import ContactPage from "@/react-app/pages/Contact";
import MarriageCertificatePage from "@/react-app/pages/MarriageCertificate";
import ServiceRequestPage from "@/react-app/pages/ServiceRequest";
import TrackPage from "@/react-app/pages/Track";
import StaffLoginPage from "@/react-app/pages/staff/Login";
import AuthCallbackPage from "@/react-app/pages/auth/Callback";
import StaffDashboardPage from "@/react-app/pages/staff/Dashboard";
import CMSPage from "@/react-app/pages/staff/CMS";
import ArticleEditorPage from "@/react-app/pages/staff/ArticleEditor";
import AnnouncementEditorPage from "@/react-app/pages/staff/AnnouncementEditor";
import ProjectEditorPage from "@/react-app/pages/staff/ProjectEditor";
import UserManagementPage from "@/react-app/pages/staff/UserManagement";
import DepartmentDashboardPage from "@/react-app/pages/staff/DepartmentDashboard";
import MarriageApplicationsPage from "@/react-app/pages/staff/MarriageApplications";
import ServiceRequestsPage from "@/react-app/pages/staff/ServiceRequests";
import ProjectsManagementPage from "@/react-app/pages/staff/ProjectsManagement";
import StaffDirectoryPage from "@/react-app/pages/staff/StaffDirectory";
import ReportsPage from "@/react-app/pages/staff/Reports";
import CalendarPage from "@/react-app/pages/staff/Calendar";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public website */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/leadership" element={<Navigate to="/about" replace />} />
          <Route path="/about/structure" element={<Navigate to="/about" replace />} />
          <Route path="/chairman" element={<ChairmanOfficePage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/tourism" element={<TourismPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services/marriage-certificate" element={<MarriageCertificatePage />} />
          <Route path="/services/request" element={<ServiceRequestPage />} />
          <Route path="/services/track" element={<Navigate to="/track" replace />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/privacy" element={<Navigate to="/contact" replace />} />
          <Route path="/terms" element={<Navigate to="/contact" replace />} />
          <Route path="/accessibility" element={<Navigate to="/contact" replace />} />
          
          {/* Auth */}
          <Route path="/login" element={<Navigate to="/staff/login" replace />} />
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* Staff Portal */}
          <Route path="/staff" element={<StaffDashboardPage />} />
          <Route path="/staff/cms" element={<CMSPage />} />
          <Route path="/staff/cms/articles/new" element={<ArticleEditorPage />} />
          <Route path="/staff/cms/articles/:id" element={<ArticleEditorPage />} />
          <Route path="/staff/cms/announcements/new" element={<AnnouncementEditorPage />} />
          <Route path="/staff/cms/announcements/:id" element={<AnnouncementEditorPage />} />
          <Route path="/staff/cms/projects/new" element={<ProjectEditorPage />} />
          <Route path="/staff/cms/projects/:id" element={<ProjectEditorPage />} />
          <Route path="/staff/users" element={<UserManagementPage />} />
          <Route path="/staff/department" element={<DepartmentDashboardPage />} />
          <Route path="/staff/marriage-applications" element={<MarriageApplicationsPage />} />
          <Route path="/staff/service-requests" element={<ServiceRequestsPage />} />
          <Route path="/staff/requests" element={<Navigate to="/staff/service-requests" replace />} />
          <Route path="/staff/projects" element={<ProjectsManagementPage />} />
          <Route path="/staff/directory" element={<StaffDirectoryPage />} />
          <Route path="/staff/reports" element={<ReportsPage />} />
          <Route path="/staff/calendar" element={<CalendarPage />} />
          <Route path="/staff/documents" element={<Navigate to="/staff/reports" replace />} />
          <Route path="/staff/messages" element={<Navigate to="/staff/calendar" replace />} />
          <Route path="/staff/departments" element={<Navigate to="/staff/department" replace />} />
          <Route path="/staff/settings" element={<Navigate to="/staff/users" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
