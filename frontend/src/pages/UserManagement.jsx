import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Replace with your FastAPI backend URL

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Create user
  const createUser = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users`, form);
      alert("User created successfully!");
      setForm({ username: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  // Update user
  const updateUser = async () => {
    try {
      await axios.put(`${API_BASE_URL}/users/${selectedUser.id}`, form);
      alert("User updated successfully!");
      setForm({ username: "", email: "", password: "" });
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle edit click
  const handleEdit = (user) => {
    setSelectedUser(user);
    setForm({ username: user.username, email: user.email, password: "" });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      updateUser();
    } else {
      createUser();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">User Management</h1>

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required={!selectedUser} // Only required for new users
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {selectedUser ? "Update User" : "Create User"}
          </button>
        </form>

        <h2 className="text-xl font-bold text-gray-700 mb-4">User List</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-2 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-2 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
