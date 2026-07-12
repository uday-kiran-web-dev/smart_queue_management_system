import { useState } from "react";
import { CheckCircle2, FastForward, XCircle, Eye, X, Mic } from "lucide-react";

export default function QueueTable({ queue, onComplete, onSkip, onCancel, onCall }) {
  const [selectedToken, setSelectedToken] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleAction = async (actionFn, tokenId) => {
    await actionFn(tokenId, feedback);
    setSelectedToken(null);
    setFeedback("");
  };

  const handleCloseModal = () => {
    setSelectedToken(null);
    setFeedback("");
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl bg-white shadow border border-slate-200">
        <table className="min-w-full">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4 text-left font-medium text-sm">Spot in Line</th>
              <th className="p-4 text-left font-medium text-sm">Student Name</th>
              <th className="p-4 text-left font-medium text-sm">Scheduled Date</th>
              <th className="p-4 text-left font-medium text-sm">Status</th>
              <th className="p-4 text-left font-medium text-sm">Actions</th>
            </tr>
          </thead>

          <tbody>
            {queue.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-medium text-slate-600 mb-1">No spots found</p>
                    <p className="text-sm text-slate-400">The queue is currently empty.</p>
                  </div>
                </td>
              </tr>
            ) : (
              queue.map((student) => (
                <tr key={student._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{student.token_number}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{student.student_name || student.student_id}</div>
                    <div className="text-xs text-slate-500">{student.student_email || "No email provided"}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                    {student.scheduled_at ? new Date(student.scheduled_at).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : "Walk-in"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      student.status === "waiting" ? "bg-blue-100 text-blue-700" :
                      student.status === "called" ? "bg-purple-100 text-purple-700" :
                      student.status === "completed" ? "bg-green-100 text-green-700" :
                      student.status === "skipped" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {student.status === "waiting" && (
                        <button
                          onClick={() => onCall(student._id)}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <Mic size={16} /> Call
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedToken(student)}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm"
                      >
                        <Eye size={16} /> Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Queue Details Modal */}
      {selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Queue Details</h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Spot in Line</p>
                  <p className="text-4xl font-black text-slate-800">{selectedToken.token_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  selectedToken.status === "waiting" ? "bg-blue-100 text-blue-700" :
                  selectedToken.status === "called" ? "bg-purple-100 text-purple-700" :
                  selectedToken.status === "completed" ? "bg-green-100 text-green-700" :
                  selectedToken.status === "skipped" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {selectedToken.status}
                </span>
              </div>

              <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Student</p>
                  <p className="text-base font-semibold text-slate-800">{selectedToken.student_name || selectedToken.student_id}</p>
                  <p className="text-sm text-slate-600">{selectedToken.student_email || "No email provided"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Reason for Visit</p>
                  <p className="text-base text-slate-800">{selectedToken.purpose || "None specified"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Scheduled Time</p>
                    <p className="text-base text-slate-800">
                      {selectedToken.scheduled_at ? new Date(selectedToken.scheduled_at).toLocaleString() : "Walk-in"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Created At</p>
                    <p className="text-base text-slate-800">
                      {new Date(selectedToken.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedToken.admin_feedback && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-1">Admin Feedback / Notes</p>
                    <p className="text-base text-slate-800 bg-slate-100 p-3 rounded-lg border border-slate-200">
                      {selectedToken.admin_feedback}
                    </p>
                  </div>
                )}
              </div>

              {["waiting", "called"].includes(selectedToken.status) && (
                <div className="mt-6">
                  <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Feedback / Notes (Optional)
                  </label>
                  <textarea
                    id="feedback"
                    rows="3"
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Provide a reason for skipping/cancelling or general notes..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>

            {/* Modal Footer / Actions */}
            {["waiting", "called"].includes(selectedToken.status) ? (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleAction(onComplete, selectedToken._id)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-semibold"
                >
                  <CheckCircle2 size={24} /> 
                  <span className="text-sm">Complete</span>
                </button>
                <button
                  onClick={() => handleAction(onSkip, selectedToken._id)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors font-semibold"
                >
                  <FastForward size={24} /> 
                  <span className="text-sm">Skip</span>
                </button>
                <button
                  onClick={() => handleAction(onCancel, selectedToken._id)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-semibold"
                >
                  <XCircle size={24} /> 
                  <span className="text-sm text-center">Cancel Appointment</span>
                </button>
              </div>
            ) : (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <p className="text-center text-slate-500 text-sm">No actions available for {selectedToken.status} spots.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
