export default function QueueTable({ queue, onComplete, onSkip }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 text-left">Token</th>

            <th className="p-4 text-left">Student</th>

            <th className="p-4 text-left">Status</th>

            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {queue.map((student) => (
            <tr key={student._id} className="border-b">
              <td className="p-4">{student.token_number}</td>

              <td className="p-4">{student.student_id}</td>

              <td className="p-4 capitalize">{student.status}</td>

              <td className="space-x-2 p-4">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
