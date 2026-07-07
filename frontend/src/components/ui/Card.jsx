export default function Card({ title, children }) {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-bold">{title}</h1>

      {children}
    </div>
  );
}
