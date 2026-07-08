export default function DepartmentSelector({
  departments,
  selectedDepartment,
  onChange,
}) {
  return (
    <div className="mb-6">
      <label className="mb-2 block font-medium">
        Select Department
      </label>

      <select
        value={selectedDepartment}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 p-3"
      >
        <option value="">
          Select Department
        </option>

        {departments.map((department) => (
          <option
            key={department._id}
            value={department._id}
          >
            {department.name}
          </option>
        ))}
      </select>
    </div>
  );
}