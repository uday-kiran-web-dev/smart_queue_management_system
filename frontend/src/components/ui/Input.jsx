export default function Input({
  label,
  type = "text",
  register,
  name,
  error,
  placeholder,
}) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
