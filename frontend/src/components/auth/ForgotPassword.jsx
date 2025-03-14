import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Auth_Header";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // calls POST /auth/forgot-password
      const response = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The backend is checking `req.email` or `req.username`.
        // If your backend uses "username" instead, change the field name to "username": email
        body: JSON.stringify({ email }), 
      });

      if (response.ok) {
        alert("Check your email for the reset link.");
        navigate("/check-email");
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Error sending reset link.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <Header heading="Recover Password" paragraph="Remembered? " linkName="Login" linkUrl="/login" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded mt-1"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
