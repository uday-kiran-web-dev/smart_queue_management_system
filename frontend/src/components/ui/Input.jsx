export default function Input({
  label,
  type = "text",
  register,
  name,
  validation,
  error,
  placeholder,
}) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        className={`w-full rounded-lg border p-3 focus:outline-none ${
          error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
        }`}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
