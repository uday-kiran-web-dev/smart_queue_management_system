import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";

import AuthLayout from "../../layouts/AuthLayout";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

/* -------------------------------------------------
  Register component – user registration page
  ------------------------------------------------- */
export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/register", data);

      //alert("Registration successful");
      toast.success("Registration successful");

      navigate("/");
    } catch (error) {
      //alert(error.response?.data?.detail || "Registration failed");
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card title="Create Account">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            name="name"
            placeholder="Enter your name"
            register={register}
            error={errors.name}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            register={register}
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            register={register}
            error={errors.password}
          />

          <Button loading={loading} type="submit">
            Register
          </Button>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}
