import React, { useState } from "react";
import axios from "axios";
// import "../index.css";
import { FcGoogle } from "react-icons/fc";
import { FaPhone } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Divider from '@mui/material/Divider';


export default function SignupCustomer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "consumer",
    isVerified: false,
    address: {
      line1: "",
      line2: "",
      unit_no: "",
      postal_code: "",
      city: "",
      province: "",
      country: "Canada",
      longitude: "43.516788",
      latitude: "-80.501572",
    },
  });

  const [errors, setErrors] = useState({});
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["line1", "line2", "unit_no", "postal_code", "city", "province"].includes(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
      // setTimeout(fetchCoordinates, 1000); // Delay fetching coordinates
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // Top-level fields
    // if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.first_name.trim()) newErrors.first_name = "First Name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone must be 10 digits (e.g., 1234567890)";

    // Address fields
    if (!formData.address.line1.trim()) newErrors.line1 = "Address Line 1 is required";
    if (!formData.address.postal_code.match(/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/))
      newErrors.postal_code = "Invalid postal code (e.g., A1A 1A1)";
    if (!formData.address.province.trim()) newErrors.province = "Province is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("https://fixifyaws-backend-new-production.up.railway.app/signup", formData);
      const { userId } = response.data;
      console.log("User registered:", response.data);
      navigate("/verify-customer", { state: { userId, email: formData.email } });
    } catch (error) {
      console.error("Signup error:", error.response?.data || error);
      alert(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to bottom right, #7e57c2, #000)",
        color: "white",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>FIXIFY!</h1>
          <p style={{ fontSize: "1.125rem" }}>FIND. CONNECT. FIX!</p>
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: "50%",
          padding: "2rem",
          borderTopLeftRadius: "1.5rem",
          borderBottomLeftRadius: "1.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "black" }}>
          Create Account
        </h2>

        <div style={{ display: "flex", width: "100%", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
            }}
          >
            <FcGoogle />
            Sign up with Google
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
            }}
          >
            <FaPhone />
            Sign up with phone
          </button>
        </div>

        <p style={{ marginBottom: "1rem", color: "black" }}>-OR-</p>

        <form style={{ width: "100%", maxWidth: "20rem" }} onSubmit={handleSubmit}>

          <div style={{ marginBottom: "1rem", display: "flex", gap: "3rem" }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                name="first_name"
                value={formData.first_name}
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  color: "black",
                  outline: "none",
                }}
              />
              {errors.first_name && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.first_name}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                name="last_name"
                value={formData.last_name}
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  color: "black",
                  outline: "none",
                }}
              />
              {errors.last_name && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.last_name}</span>}
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <input
              type="email"
              placeholder="Email Address"
              // onChange={handleChange}
              name="email"
              value={formData.email}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  email: value,
                  username: value, // Automatically update username when email changes
                }));
              }}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                color: "black",
                outline: "none",
              }}
            />
            {errors.email && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.email}</span>}
          </div>

          <div style={{ marginBottom: "1rem", position: "relative" }}>
            <input
              type="password"
              placeholder="Password"
              onChange={handleChange}
              name="password"
              value={formData.password}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                color: "black",
                outline: "none",
              }}
            />
            {errors.password && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.password}</span>}
          </div>

          <div style={{ marginBottom: "1rem", position: "relative" }}>
            <input
              type="tel"
              placeholder="Phone Number (e.g., 1234567890)"
              onChange={handleChange}
              name="phone"
              value={formData.phone}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                color: "black",
                outline: "none",
              }}
            />
            {errors.phone && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.phone}</span>}
            <Divider component="li" />

          </div>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="123 Main St"
              onChange={handleChange}
              name="line1"
              value={formData.address.line1}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                color: "black",
                outline: "none",
              }}
            />
            {errors.line1 && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.line1}</span>}
          </div>
          <div style={{ marginBottom: "1rem", display: "flex", gap: "3rem" }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="City"
                  onChange={handleChange}
                  name="city"
                  value={formData.address.city}
                  style={{
                    width: "100%",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    color: "black",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ flex: 1.5 }}>
                <select
                  name="province"
                  onChange={handleChange}
                  value={formData.address.province}
                  style={{
                    width: "100%",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    color: "black",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">Select a Province</option>
                  <option value="Alberta">Alberta</option>
                  <option value="British Columbia">British Columbia</option>
                  <option value="Manitoba">Manitoba</option>
                  <option value="New Brunswick">New Brunswick</option>
                  <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                  <option value="Nova Scotia">Nova Scotia</option>
                  <option value="Ontario">Ontario</option>
                  <option value="Prince Edward Island">Prince Edward Island</option>
                  <option value="Quebec">Quebec</option>
                  <option value="Saskatchewan">Saskatchewan</option>
                </select>
                {errors.province && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.province}</span>}
            </div>
            </div>

          <div style={{ marginBottom: "1rem", display: "flex", gap: "3rem" }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Postal Code (e.g., A1A 1A1)"
                onChange={handleChange}
                name="postal_code"
                value={formData.address.postal_code}
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  color: "black",
                  outline: "none",
                }}
              />
              {errors.postal_code && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.postal_code}</span>}
            </div>

          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#ef4444",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Create Account
          </button>
        </form>

        <p style={{ marginTop: "1rem", color: "black" }}>
          Already Have An Account? <a href="#" style={{ color: "#7c3aed", textDecoration: "underline" }}>Log In</a>
        </p>
      </div>
    </div>
  );
}
