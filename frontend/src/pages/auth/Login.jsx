import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

// User login page
export default function Login() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", data);

      login(response.data);
      toast.success("Welcome back!");

      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      //alert(error.response?.data?.detail || "Login failed");
      toast.error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Queue Management
        </h1>

        <input
          {...register("email")}
          placeholder="Email"
          className="border p-3 rounded w-full mb-4"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="border p-3 rounded w-full mb-6"
        />

        <Button loading={loading}>Login</Button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link className="text-blue-600" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
