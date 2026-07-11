import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./GenerateToken.css";
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  generateToken,
  getDepartments,
  getMyToken,
} from "../../services/dashboardService";
import { AuthContext } from "../../context/AuthContext";

const COMMON_REASONS = [
  "Fee Payment",
  "Academic Advising",
  "Certificate Request",
  "General Inquiry",
  "Other"
];

// Step-by-step token generation wizard
export default function GenerateToken() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  const [selectedReasonChip, setSelectedReasonChip] = useState("");
  const [purpose, setPurpose] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [scheduledAt, setScheduledAt] = useState(null);
  const [myTokens, setMyTokens] = useState([]);
  const { user } = useContext(AuthContext);

  // Wizard state
  const [step, setStep] = useState(1);
  const [bookingMode, setBookingMode] = useState(null); // 'now' or 'later'

  // Load departments
  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        toast.error("Failed to load offices");
      }
    }
    loadDepartments();
  }, []);

  // Load the student's current tokens
  useEffect(() => {
    async function loadMyTokens() {
      try {
        const data = await getMyToken();
        setMyTokens(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load existing tokens:", error);
      }
    }
    loadMyTokens();
  }, []);

  if (user?.role !== "student") {
    return (
      <DashboardLayout>
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="mb-6 text-3xl font-bold">Get a Spot in Line</h1>
          <p className="text-gray-500">This page is only for students.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleGenerateToken = async (e, forceWalkIn = false) => {
    if (e) e.preventDefault();
    
    if (!selectedDepartment) {
      toast.error("Please select an office");
      return;
    }

    setLoading(true);
    const hasWaitingToken = myTokens.some(
      (t) => t.department_id === selectedDepartment && t.status === "waiting",
    );
    if (hasWaitingToken) {
      toast.error(
        "You already have a waiting spot for this office. Please wait until it is called or completed.",
      );
      setLoading(false);
      return;
    }

    const finalScheduledAt = forceWalkIn ? null : scheduledAt;

    if (finalScheduledAt) {
      const now = new Date();
      if (finalScheduledAt <= now) {
        toast.error("Please select a future date and time.");
        setLoading(false);
        return;
      }
      const day = finalScheduledAt.getDay(); 
      const hour = finalScheduledAt.getHours();

      if (day === 0 || day === 6) {
        toast.error("Appointments can only be scheduled on weekdays.");
        setLoading(false);
        return;
      }
      if (hour < 9 || hour >= 16) {
        toast.error("Appointments must be scheduled between 9 AM and 4 PM.");
        setLoading(false);
        return;
      }
    }

    const finalPurpose = selectedReasonChip === "Other" ? purpose : selectedReasonChip;

    try {
      const data = await generateToken(
        selectedDepartment,
        finalPurpose,
        finalScheduledAt ? finalScheduledAt.toISOString() : null,
      );
      setToken(data.token);
      toast.success("Spot reserved successfully!");
      
      const refreshed = await getMyToken();
      setMyTokens(Array.isArray(refreshed) ? refreshed : []);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to get spot in line");
    } finally {
      setLoading(false);
    }
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold transition-colors ${
            step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
          }`}>
            {s}
          </div>
          {s < 3 && (
            <div className={`h-1 w-12 ml-4 rounded transition-colors ${
              step > s ? "bg-blue-600" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
        
        {!token ? (
          <>
            <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Get a Spot in Line</h1>
            <p className="text-center text-slate-500 mb-8">Fast, easy, and hassle-free scheduling.</p>
            
            {renderStepIndicator()}

            <div className="min-h-[300px]">
              {/* STEP 1: Select Office */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-xl font-semibold mb-4">1. Who would you like to see?</h2>
                  {departments.length === 0 ? (
                    <p className="text-gray-500">Loading offices...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {departments.map((dept) => {
                        const isSelected = selectedDepartment === dept._id;
                        return (
                          <div
                            key={dept._id}
                            onClick={() => setSelectedDepartment(dept._id)}
                            className={`cursor-pointer rounded-xl border-2 p-5 flex items-center transition-all ${
                              isSelected 
                                ? "border-blue-600 bg-blue-50 shadow-md" 
                                : "border-gray-100 hover:border-blue-300 hover:shadow"
                            }`}
                          >
                            <div className={`p-3 rounded-full mr-4 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                              <Building2 size={24} />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold text-lg ${isSelected ? "text-blue-900" : "text-slate-800"}`}>
                                {dept.name}
                              </h3>
                            </div>
                            {isSelected && <CheckCircle2 className="text-blue-600" size={24} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      disabled={!selectedDepartment}
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                    >
                      Next Step <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Reason for Visit */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-xl font-semibold mb-4">2. What do you need help with?</h2>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {COMMON_REASONS.map((reason) => {
                      const isSelected = selectedReasonChip === reason;
                      return (
                        <button
                          key={reason}
                          onClick={() => setSelectedReasonChip(reason)}
                          className={`px-5 py-2.5 rounded-full border-2 transition-all font-medium ${
                            isSelected 
                              ? "border-blue-600 bg-blue-600 text-white shadow-md" 
                              : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {reason}
                        </button>
                      );
                    })}
                  </div>

                  {selectedReasonChip === "Other" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Please specify your reason:
                      </label>
                      <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="e.g., Submitting medical documents"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-slate-500 hover:text-slate-800 px-4 py-3 font-medium transition-colors"
                    >
                      <ChevronLeft size={20} /> Back
                    </button>
                    <button
                      disabled={!selectedReasonChip || (selectedReasonChip === "Other" && !purpose.trim())}
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                    >
                      Next Step <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Timing */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-xl font-semibold mb-6">3. When would you like to visit?</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Walk In */}
                    <div 
                      onClick={() => setBookingMode("now")}
                      className={`cursor-pointer rounded-2xl border-2 p-6 transition-all text-center ${
                        bookingMode === "now" ? "border-blue-600 bg-blue-50 shadow-md" : "border-slate-200 hover:border-blue-300 hover:shadow"
                      }`}
                    >
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        bookingMode === "now" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Users size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Join Line Now</h3>
                      <p className="text-slate-500 text-sm">Walk in and join the virtual queue immediately.</p>
                    </div>

                    {/* Schedule */}
                    <div 
                      onClick={() => setBookingMode("later")}
                      className={`cursor-pointer rounded-2xl border-2 p-6 transition-all text-center ${
                        bookingMode === "later" ? "border-blue-600 bg-blue-50 shadow-md" : "border-slate-200 hover:border-blue-300 hover:shadow"
                      }`}
                    >
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        bookingMode === "later" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <Clock size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Book for Later</h3>
                      <p className="text-slate-500 text-sm">Schedule an appointment for a specific date and time.</p>
                    </div>
                  </div>

                  {bookingMode === "later" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Date & Time (Weekdays 9 AM - 4 PM)
                      </label>
                      <div className="w-full">
                        <DatePicker
                          selected={scheduledAt}
                          onChange={(date) => setScheduledAt(date)}
                          showTimeSelect
                          filterDate={isWeekday}
                          minDate={new Date()}
                          minTime={new Date(new Date().setHours(9, 0, 0, 0))}
                          maxTime={new Date(new Date().setHours(15, 59, 0, 0))}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          placeholderText="Click to select a date and time"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-600 transition-colors text-lg"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 text-slate-500 hover:text-slate-800 px-4 py-3 font-medium transition-colors"
                    >
                      <ChevronLeft size={20} /> Back
                    </button>
                    
                    <button
                      disabled={loading || !bookingMode || (bookingMode === 'later' && !scheduledAt)}
                      onClick={(e) => handleGenerateToken(e, bookingMode === 'now')}
                      className="flex items-center gap-2 bg-green-600 text-white px-8 py-3.5 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
                    >
                      {loading ? "Processing..." : "Confirm & Get Spot"} 
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-500 py-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-slate-800">You're all set!</h2>
            <p className="text-center text-slate-500">Your spot in line has been reserved successfully.</p>
            
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 max-w-sm mx-auto shadow-inner mt-8">
              <p className="text-sm text-slate-500 uppercase tracking-wider font-bold text-center mb-2">Your Spot in Line</p>
              <p className="text-5xl font-black text-slate-800 text-center tracking-tight">
                {token.token_number}
              </p>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={() => {
                  setToken(null);
                  setStep(1);
                  setSelectedDepartment("");
                  setSelectedReasonChip("");
                  setPurpose("");
                  setBookingMode(null);
                  setScheduledAt(null);
                }}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
