import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

const skillsList = [
  "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning", "HVAC Repair", "Gardening",
  "Pest Control", "Roofing", "Masonry", "Appliance Repair", "Flooring", "Locksmith",
  "Window Cleaning", "Handyman", "Drywall Repair", "Tile Work", "Furniture Assembly",
  "Pressure Washing", "Pool Maintenance",
];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = ["Morning", "Afternoon", "Evening"];
const provinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
  "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
  "Northwest Territories", "Nunavut", "Yukon",
];

const ServiceProviderSignup = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [redirectMessage, setRedirectMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "provider",
    bio: "",
    skills: [],
    hourlyRate: "",
    serviceDescription: "",
    schedule: {},
    address: {
      line1: "",
      line2: "",
      unit_no: "",
      postal_code: "",
      city: "",
      province: "",
      country: "Canada",
      longitude: 123123123,
      latitude: 123123123,
    },
  });

  // --------------------------
  // Handlers
  // --------------------------

  const handleSkillsChange = (event) => {
    setFormData((prev) => ({ ...prev, skills: event.target.value }));
  };

  const handleProvinceChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, province: event.target.value },
    }));
  };

  const handleScheduleChange = (day, time) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day]?.includes(time)
          ? prev.schedule[day].filter((t) => t !== time)
          : [...(prev.schedule[day] || []), time],
      },
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --------------------------
  // Validation
  // --------------------------

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone must be 10 digits (e.g., 1234567890)";
    if (!formData.address.line1.trim()) newErrors["address.line1"] = "Address Line 1 is required";
    if (!formData.address.postal_code.match(/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/))
      newErrors["address.postal_code"] = "Invalid postal code (e.g., A1A 1A1)";
    if (!formData.address.province) newErrors["address.province"] = "Province is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
    if (!formData.hourlyRate || formData.hourlyRate <= 0) newErrors.hourlyRate = "Hourly rate must be a positive number";
    if (!formData.serviceDescription.trim()) newErrors.serviceDescription = "Service description is required";
    if (Object.keys(formData.schedule).length === 0) newErrors.schedule = "At least one time slot must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --------------------------
  // Step Navigation
  // --------------------------

  const handleNext = () => {
    if (activeStep === 0) {
      if (validateStep1()) {
        setActiveStep((prev) => prev + 1);
        setErrors({});
        setServerError("");
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
  };

  // --------------------------
  // Submit Handler
  // --------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (activeStep === 1 && validateStep2()) {
      // Combine formData into the payload
      const payload = {
        username: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: "provider",
        address: formData.address,
        schedule: formData.schedule,
        skills: formData.skills,
        hourlyRate: formData.hourlyRate,
        serviceDescription: formData.serviceDescription,
      };

      console.log("Signup payload:", payload);

      try {
        const response = await fetch("fixifyaws-backend-new-production.up.railway.app/worker-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        console.log("Signup result:", result);

        if (!response.ok) {
          if (result.message && result.message.toLowerCase().includes("exists")) {
            setErrors((prev) => ({ ...prev, email: result.message }));
            setActiveStep(0);
          } else {
            setServerError(result.message || "Signup failed. Please try again.");
          }
        } else {
          const { userId } = result;
          // Inform the user before navigating to the verification page.
          setRedirectMessage("Taking you to the verification page....");
          setTimeout(() => {
            navigate("/verify-customer", { state: { userId, email: formData.email } });
          }, 4000); // waits 2 seconds before navigation
        }
      } catch (error) {
        console.error("Signup failed:", error);
        setServerError("Signup failed. Please try again later.");
      }
    }
  };

  // --------------------------
  // UI Rendering
  // --------------------------

  // If redirectMessage is set, display a full-page message.
  if (redirectMessage) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(to right, #7F7FD5, #86A8E7, #91EAE4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Typography variant="h5" sx={{ color: "#fff" }}>
          {redirectMessage}
        </Typography>
      </Box>
    );
  }

  return (
    // Full-page gradient background
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(to right, #7F7FD5, #86A8E7, #91EAE4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ display: "flex", borderRadius: 2, overflow: "hidden" }}>
          {/* Left Panel */}

          {/* Right Panel */}
          <Box sx={{ flex: 2, p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              {activeStep === 0
                ? "Step 1: Basic Information"
                : "Step 2: Skills & Schedule"}
            </Typography>

            {/* Display server-wide error, if any */}
            {serverError && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {serverError}
              </Typography>
            )}

            {/* Stepper Indicator */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Step 1</StepLabel>
              </Step>
              <Step>
                <StepLabel>Step 2</StepLabel>
              </Step>
            </Stepper>

            {/* Step 1 Fields */}
            {activeStep === 0 && (
              <Box component="form" noValidate onSubmit={handleNext}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      name="address.line1"
                      value={formData.address.line1}
                      onChange={handleChange}
                      required
                      error={!!errors["address.line1"]}
                      helperText={errors["address.line1"]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2 (optional)"
                      name="address.line2"
                      value={formData.address.line2}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      name="address.postal_code"
                      value={formData.address.postal_code}
                      onChange={handleChange}
                      required
                      error={!!errors["address.postal_code"]}
                      helperText={errors["address.postal_code"]}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth error={!!errors["address.province"]}>
                      <InputLabel>Province</InputLabel>
                      <Select
                        value={formData.address.province}
                        onChange={handleProvinceChange}
                        label="Province"
                      >
                        <MenuItem value="">
                          <em>Select Province</em>
                        </MenuItem>
                        {provinces.map((province) => (
                          <MenuItem key={province} value={province}>
                            {province}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors["address.province"] && (
                        <Typography variant="caption" color="error">
                          {errors["address.province"]}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" color="primary" type="submit">
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 2 Fields */}
            {activeStep === 1 && (
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth error={!!errors.skills}>
                      <InputLabel>Skills</InputLabel>
                      <Select
                        multiple
                        value={formData.skills}
                        onChange={handleSkillsChange}
                        label="Skills"
                      >
                        {skillsList.map((skill) => (
                          <MenuItem key={skill} value={skill}>
                            {skill}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.skills && (
                        <Typography variant="caption" color="error">
                          {errors.skills}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Hourly Rate ($)"
                      name="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      required
                      error={!!errors.hourlyRate}
                      helperText={errors.hourlyRate}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Service Description"
                      name="serviceDescription"
                      multiline
                      rows={3}
                      value={formData.serviceDescription}
                      onChange={handleChange}
                      required
                      error={!!errors.serviceDescription}
                      helperText={errors.serviceDescription}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Schedule
                    </Typography>
                    {errors.schedule && (
                      <Typography variant="caption" color="error">
                        {errors.schedule}
                      </Typography>
                    )}
                    {daysOfWeek.map((day) => (
                      <Grid key={day} container spacing={1} alignItems="center">
                        <Typography
                          variant="body1"
                          sx={{ minWidth: "100px", fontWeight: 500 }}
                        >
                          {day}
                        </Typography>
                        {timeSlots.map((slot) => (
                          <FormControlLabel
                            key={slot}
                            control={
                              <Checkbox
                                checked={
                                  formData.schedule[day]?.includes(slot) || false
                                }
                                onChange={() => handleScheduleChange(day, slot)}
                              />
                            }
                            label={slot}
                          />
                        ))}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button variant="outlined" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ServiceProviderSignup;
