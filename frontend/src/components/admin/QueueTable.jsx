export default function QueueTable({ queue, onComplete, onSkip }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 text-left">Token</th>
            <th className="p-4 text-left">Student Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Purpose</th>
            <th className="p-4 text-left">Scheduled Time</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {queue.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-6 text-center text-gray-500">
                No tokens found.
              </td>
            </tr>
          ) : (
            queue.map((student) => (
              <tr key={student._id} className="border-b">
                <td className="p-4">{student.token_number}</td>
                <td className="p-4">
                  {student.student_name || student.student_id}
                </td>
                <td className="p-4">{student.student_email || "-"}</td>
                <td className="p-4 text-sm">{student.purpose || "-"}</td>
                <td className="p-4 text-sm">
                  {student.scheduled_at
                    ? new Date(student.scheduled_at).toLocaleString()
                    : "-"}
                </td>
                <td className="p-4 capitalize">{student.status}</td>
                <td className="space-x-2 p-4">
                  {["waiting", "called"].includes(student.status) ? (
                    <>
                      <button
                        onClick={() => onComplete(student._id)}
                        className="rounded bg-green-600 px-3 py-2 text-white"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => onSkip(student._id)}
                        className="rounded bg-yellow-500 px-3 py-2 text-white"
                      >
                        Skip
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400">No actions</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
