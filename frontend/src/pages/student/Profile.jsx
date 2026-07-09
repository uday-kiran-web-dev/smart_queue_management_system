import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "../../services/dashboardService";

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    current_password: "",
  });

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        current_password: "",
      });
    }
  }, [user]);

  const handleEditClick = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      current_password: "",
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Only send fields that are not empty
      const dataToUpdate = {};
      if (formData.name && formData.name !== user?.name) {
        dataToUpdate.name = formData.name;
      }
      if (formData.email && formData.email !== user?.email) {
        dataToUpdate.email = formData.email;
      }
      if (formData.password) {
        if (!formData.current_password) {
          toast.error("Current password is required to change password");
          setLoading(false);
          return;
        }
        dataToUpdate.password = formData.password;
        dataToUpdate.current_password = formData.current_password;
      }

      if (Object.keys(dataToUpdate).length === 0) {
        toast.error("No changes to update");
        setLoading(false);
        return;
      }

      const response = await updateProfile(dataToUpdate);

      // Update auth context with new user data
      if (response.user) {
        login({
          access_token: localStorage.getItem("token"),
          user: response.user,
        });
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      setFormData({
        name: response.user?.name || "",
        email: response.user?.email || "",
        password: "",
        current_password: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl rounded-xl bg-white p-8 shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-5">
            <div>
              <p className="text-gray-500">Name</p>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <h2 className="text-xl font-semibold">{user?.email}</h2>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <h2 className="text-xl font-semibold capitalize">{user?.role}</h2>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password (leave empty to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {formData.password && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password (required to change password)
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                    password: "",
                    current_password: "",
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
