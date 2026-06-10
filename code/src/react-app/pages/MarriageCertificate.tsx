import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Heart, Users, FileText, CheckCircle, Search, Loader2, Calendar, User, Phone } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara"
];

const maritalStatuses = ["Single (Never Married)", "Divorced", "Widowed"];
const marriageTypes = ["Statutory Marriage", "Customary Marriage", "Islamic Marriage"];

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  // Groom
  groom_surname: string;
  groom_first_name: string;
  groom_other_names: string;
  groom_dob: string;
  groom_place_of_birth: string;
  groom_occupation: string;
  groom_address: string;
  groom_phone: string;
  groom_email: string;
  groom_state_of_origin: string;
  groom_lga: string;
  groom_father_name: string;
  groom_mother_name: string;
  groom_marital_status: string;
  // Bride
  bride_surname: string;
  bride_first_name: string;
  bride_other_names: string;
  bride_dob: string;
  bride_place_of_birth: string;
  bride_occupation: string;
  bride_address: string;
  bride_phone: string;
  bride_email: string;
  bride_state_of_origin: string;
  bride_lga: string;
  bride_father_name: string;
  bride_mother_name: string;
  bride_marital_status: string;
  // Marriage
  proposed_marriage_date: string;
  proposed_venue: string;
  marriage_type: string;
  // Witnesses
  witness1_name: string;
  witness1_address: string;
  witness1_phone: string;
  witness2_name: string;
  witness2_address: string;
  witness2_phone: string;
}

const initialFormData: FormData = {
  groom_surname: "", groom_first_name: "", groom_other_names: "", groom_dob: "",
  groom_place_of_birth: "", groom_occupation: "", groom_address: "", groom_phone: "",
  groom_email: "", groom_state_of_origin: "", groom_lga: "", groom_father_name: "",
  groom_mother_name: "", groom_marital_status: "",
  bride_surname: "", bride_first_name: "", bride_other_names: "", bride_dob: "",
  bride_place_of_birth: "", bride_occupation: "", bride_address: "", bride_phone: "",
  bride_email: "", bride_state_of_origin: "", bride_lga: "", bride_father_name: "",
  bride_mother_name: "", bride_marital_status: "",
  proposed_marriage_date: "", proposed_venue: "", marriage_type: "",
  witness1_name: "", witness1_address: "", witness1_phone: "",
  witness2_name: "", witness2_address: "", witness2_phone: "",
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  submitted: { bg: "bg-blue-100", text: "text-blue-700", label: "Submitted" },
  under_review: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Under Review" },
  pending_payment: { bg: "bg-orange-100", text: "text-orange-700", label: "Pending Payment" },
  payment_verified: { bg: "bg-purple-100", text: "text-purple-700", label: "Payment Verified" },
  approved: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  certificate_issued: { bg: "bg-green-100", text: "text-green-700", label: "Certificate Issued" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
};

type TrackingResult = {
  application_number: string;
  status: string;
  groom_first_name: string;
  groom_surname: string;
  bride_first_name: string;
  bride_surname: string;
  proposed_marriage_date?: string | null;
  fee_amount?: number | null;
  fee_paid?: number | boolean | null;
  submitted_at: string;
  reviewed_at?: string | null;
  approved_at?: string | null;
  certificate_number?: string | null;
  certificate_issued_at?: string | null;
  rejection_reason?: string | null;
};

export default function MarriageCertificate() {
  const [activeTab, setActiveTab] = useState<"apply" | "track">("apply");
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  
  // Tracking
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [trackingError, setTrackingError] = useState("");
  const [searching, setSearching] = useState(false);

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (s: Step): boolean => {
    switch (s) {
      case 1:
        return !!(formData.groom_surname && formData.groom_first_name && formData.groom_dob && 
                  formData.groom_address && formData.groom_phone && formData.groom_marital_status);
      case 2:
        return !!(formData.bride_surname && formData.bride_first_name && formData.bride_dob && 
                  formData.bride_address && formData.bride_phone && formData.bride_marital_status);
      case 3:
        return !!(formData.proposed_marriage_date && formData.marriage_type);
      case 4:
        return !!(formData.witness1_name && formData.witness1_phone && formData.witness2_name && formData.witness2_phone);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/marriage-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setApplicationNumber(data.applicationNumber);
        setSubmitted(true);
      } else {
        alert(data.error || "Failed to submit application");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return;
    setSearching(true);
    setTrackingError("");
    setTrackingResult(null);
    
    try {
      const res = await fetch(`/api/public/marriage-applications/${trackingNumber.trim()}`);
      const data = await res.json();
      if (res.ok) {
        setTrackingResult(data);
      } else {
        setTrackingError(data.error || "Application not found");
      }
    } catch {
      setTrackingError("Failed to search. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
            s === step ? "bg-green-600 text-white scale-110" : 
            s < step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
          }`}>
            {s < step ? <CheckCircle className="w-5 h-5" /> : s}
          </div>
          {s < 5 && <div className={`w-8 h-1 mx-1 rounded ${s < step ? "bg-green-500" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );

  const renderFormField = (
    label: string, 
    field: keyof FormData, 
    type: "text" | "date" | "email" | "tel" | "select" = "text",
    options?: string[],
    required = false
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          value={formData[field]}
          onChange={(e) => updateForm(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <Input
          type={type}
          value={formData[field]}
          onChange={(e) => updateForm(field, e.target.value)}
          className="focus:ring-green-500"
        />
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Groom's Information</h3>
          <p className="text-gray-500">Please provide the groom's personal details</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {renderFormField("Surname", "groom_surname", "text", undefined, true)}
        {renderFormField("First Name", "groom_first_name", "text", undefined, true)}
        {renderFormField("Other Names", "groom_other_names")}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Date of Birth", "groom_dob", "date", undefined, true)}
        {renderFormField("Place of Birth", "groom_place_of_birth")}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Occupation", "groom_occupation")}
        {renderFormField("Marital Status", "groom_marital_status", "select", maritalStatuses, true)}
      </div>
      
      <div>
        {renderFormField("Residential Address", "groom_address", "text", undefined, true)}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Phone Number", "groom_phone", "tel", undefined, true)}
        {renderFormField("Email Address", "groom_email", "email")}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("State of Origin", "groom_state_of_origin", "select", nigerianStates)}
        {renderFormField("Local Government Area", "groom_lga")}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Father's Full Name", "groom_father_name")}
        {renderFormField("Mother's Full Name (Maiden)", "groom_mother_name")}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-pink-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Bride's Information</h3>
          <p className="text-gray-500">Please provide the bride's personal details</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {renderFormField("Surname", "bride_surname", "text", undefined, true)}
        {renderFormField("First Name", "bride_first_name", "text", undefined, true)}
        {renderFormField("Other Names", "bride_other_names")}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Date of Birth", "bride_dob", "date", undefined, true)}
        {renderFormField("Place of Birth", "bride_place_of_birth")}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Occupation", "bride_occupation")}
        {renderFormField("Marital Status", "bride_marital_status", "select", maritalStatuses, true)}
      </div>
      
      <div>
        {renderFormField("Residential Address", "bride_address", "text", undefined, true)}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Phone Number", "bride_phone", "tel", undefined, true)}
        {renderFormField("Email Address", "bride_email", "email")}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("State of Origin", "bride_state_of_origin", "select", nigerianStates)}
        {renderFormField("Local Government Area", "bride_lga")}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Father's Full Name", "bride_father_name")}
        {renderFormField("Mother's Full Name (Maiden)", "bride_mother_name")}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <Heart className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Marriage Details</h3>
          <p className="text-gray-500">Provide details about the proposed marriage</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {renderFormField("Proposed Marriage Date", "proposed_marriage_date", "date", undefined, true)}
        {renderFormField("Type of Marriage", "marriage_type", "select", marriageTypes, true)}
      </div>
      
      <div>
        {renderFormField("Proposed Venue", "proposed_venue")}
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• The proposed marriage date must be at least 21 days from the date of application</li>
          <li>• Marriage notices will be published for 21 days as required by law</li>
          <li>• Both parties must be at least 21 years old (or have parental consent if 18-20)</li>
        </ul>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Witnesses Information</h3>
          <p className="text-gray-500">Two witnesses are required for the marriage registration</p>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">First Witness</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {renderFormField("Full Name", "witness1_name", "text", undefined, true)}
          {renderFormField("Phone Number", "witness1_phone", "tel", undefined, true)}
        </div>
        <div className="mt-4">
          {renderFormField("Address", "witness1_address")}
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Second Witness</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {renderFormField("Full Name", "witness2_name", "text", undefined, true)}
          {renderFormField("Phone Number", "witness2_phone", "tel", undefined, true)}
        </div>
        <div className="mt-4">
          {renderFormField("Address", "witness2_address")}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <FileText className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Review & Submit</h3>
          <p className="text-gray-500">Please review your application before submitting</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-5">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" /> Groom
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> {formData.groom_surname} {formData.groom_first_name} {formData.groom_other_names}</p>
            <p><span className="text-gray-500">Date of Birth:</span> {formData.groom_dob}</p>
            <p><span className="text-gray-500">Phone:</span> {formData.groom_phone}</p>
            <p><span className="text-gray-500">Address:</span> {formData.groom_address}</p>
            <p><span className="text-gray-500">Status:</span> {formData.groom_marital_status}</p>
          </div>
        </div>
        
        <div className="bg-pink-50 rounded-lg p-5">
          <h4 className="font-semibold text-pink-800 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" /> Bride
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> {formData.bride_surname} {formData.bride_first_name} {formData.bride_other_names}</p>
            <p><span className="text-gray-500">Date of Birth:</span> {formData.bride_dob}</p>
            <p><span className="text-gray-500">Phone:</span> {formData.bride_phone}</p>
            <p><span className="text-gray-500">Address:</span> {formData.bride_address}</p>
            <p><span className="text-gray-500">Status:</span> {formData.bride_marital_status}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-5">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5" /> Marriage Details
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <p><span className="text-gray-500">Date:</span> {formData.proposed_marriage_date}</p>
          <p><span className="text-gray-500">Type:</span> {formData.marriage_type}</p>
          <p><span className="text-gray-500">Venue:</span> {formData.proposed_venue || "To be determined"}</p>
        </div>
      </div>
      
      <div className="bg-emerald-50 rounded-lg p-5">
        <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" /> Witnesses
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">{formData.witness1_name}</p>
            <p className="text-gray-500">{formData.witness1_phone}</p>
          </div>
          <div>
            <p className="font-medium">{formData.witness2_name}</p>
            <p className="text-gray-500">{formData.witness2_phone}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">Application Fee</h4>
        <p className="text-2xl font-bold text-amber-900">₦15,000</p>
        <p className="text-sm text-amber-700 mt-1">Payment instructions will be provided after application submission</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 w-4 h-4 text-green-600 rounded" required />
          <span className="text-sm text-gray-600">
            I declare that the information provided above is true and correct to the best of my knowledge. 
            I understand that providing false information may result in rejection of my application and possible legal consequences.
          </span>
        </label>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
      <p className="text-gray-600 mb-6">Your marriage certificate application has been received.</p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto mb-8">
        <p className="text-sm text-green-700 mb-2">Your Application Number</p>
        <p className="text-3xl font-bold text-green-800 font-mono">{applicationNumber}</p>
        <p className="text-sm text-green-600 mt-2">Please save this number to track your application status</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-lg mx-auto text-left">
        <h3 className="font-semibold text-gray-900 mb-4">Next Steps:</h3>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <span>Your application will be reviewed by our Marriage Registry team</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <span>You will receive payment instructions via phone/email</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <span>Marriage notice will be published for 21 days after payment</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
            <span>Certificate will be issued after successful completion</span>
          </li>
        </ol>
      </div>
      
      <div className="flex gap-4 justify-center mt-8">
        <Button onClick={() => { setSubmitted(false); setStep(1); setFormData(initialFormData); }} variant="outline">
          Submit Another Application
        </Button>
        <Button onClick={() => { setActiveTab("track"); setTrackingNumber(applicationNumber); }} className="bg-green-600 hover:bg-green-700">
          Track This Application
        </Button>
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Application</h2>
        <p className="text-gray-600">Enter your application number to check the status</p>
      </div>
      
      <div className="flex gap-3 mb-8">
        <Input
          placeholder="e.g. MAR-2024-ABC123"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
          className="flex-1 text-lg font-mono"
        />
        <Button onClick={handleTrack} disabled={searching} className="bg-green-600 hover:bg-green-700 px-6">
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </Button>
      </div>
      
      {trackingError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
          {trackingError}
        </div>
      )}
      
      {trackingResult && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Application Number</p>
                <p className="text-white font-bold text-xl font-mono">{trackingResult.application_number}</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${statusColors[trackingResult.status]?.bg || 'bg-gray-100'} ${statusColors[trackingResult.status]?.text || 'text-gray-700'}`}>
                {statusColors[trackingResult.status]?.label || trackingResult.status}
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Groom</p>
                  <p className="font-medium">{trackingResult.groom_first_name} {trackingResult.groom_surname}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Bride</p>
                  <p className="font-medium">{trackingResult.bride_first_name} {trackingResult.bride_surname}</p>
                </div>
              </div>
            </div>
            
            {trackingResult.proposed_marriage_date && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Proposed Marriage Date</p>
                  <p className="font-medium">{new Date(trackingResult.proposed_marriage_date).toLocaleDateString('en-NG', { dateStyle: 'long' })}</p>
                </div>
              </div>
            )}
            
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Application Timeline</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Application Submitted</p>
                    <p className="text-sm text-gray-500">{new Date(trackingResult.submitted_at).toLocaleString('en-NG')}</p>
                  </div>
                </div>
                {trackingResult.reviewed_at && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Application Reviewed</p>
                      <p className="text-sm text-gray-500">{new Date(trackingResult.reviewed_at).toLocaleString('en-NG')}</p>
                    </div>
                  </div>
                )}
                {trackingResult.approved_at && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Application Approved</p>
                      <p className="text-sm text-gray-500">{new Date(trackingResult.approved_at).toLocaleString('en-NG')}</p>
                    </div>
                  </div>
                )}
                {trackingResult.certificate_issued_at && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Certificate Issued</p>
                      <p className="text-sm text-gray-500">{new Date(trackingResult.certificate_issued_at).toLocaleString('en-NG')}</p>
                      <p className="text-green-600 font-mono mt-1">Certificate No: {trackingResult.certificate_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {trackingResult.status === 'pending_payment' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Payment Required</h4>
                <p className="text-orange-700">Fee: ₦{trackingResult.fee_amount?.toLocaleString()}</p>
                <p className="text-sm text-orange-600 mt-2">Please visit the LCDA office or contact us for payment instructions.</p>
              </div>
            )}
            
            {trackingResult.status === 'rejected' && trackingResult.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Application Rejected</h4>
                <p className="text-red-700">{trackingResult.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/services" className="inline-flex items-center gap-2 text-green-100 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Marriage Certificate Registration</h1>
          <p className="text-green-100 max-w-2xl mx-auto">
            Apply online for your marriage certificate. The process typically takes 21-30 days from application to certificate issuance.
          </p>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("apply")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "apply" 
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-5 h-5 inline-block mr-2" />
              Apply for Certificate
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "track" 
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Search className="w-5 h-5 inline-block mr-2" />
              Track Application
            </button>
          </div>
          
          <div className="p-6 md:p-8">
            {activeTab === "apply" ? (
              submitted ? renderSuccess() : (
                <>
                  {renderStepIndicator()}
                  
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderStep4()}
                  {step === 5 && renderStep5()}
                  
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    {step > 1 ? (
                      <Button variant="outline" onClick={() => setStep((step - 1) as Step)}>
                        Previous
                      </Button>
                    ) : <div />}
                    
                    {step < 5 ? (
                      <Button 
                        onClick={() => setStep((step + 1) as Step)} 
                        disabled={!validateStep(step)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmit} 
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    )}
                  </div>
                </>
              )
            ) : (
              renderTracking()
            )}
          </div>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Required Documents</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Birth Certificate or Age Declaration</li>
              <li>• Valid Government-issued ID</li>
              <li>• Passport Photographs (4 copies each)</li>
              <li>• Evidence of Single Status</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Application Review: 3-5 days</li>
              <li>• Publication Period: 21 days</li>
              <li>• Certificate Issuance: 7 days</li>
              <li>• Total: 4-5 weeks</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">Contact our Marriage Registry</p>
            <p className="text-sm font-medium text-gray-900">+234 801 234 5678</p>
            <p className="text-sm text-gray-600">registry@ikoroduwestlcda.gov.ng</p>
          </div>
        </div>
      </div>
    </div>
  );
}
