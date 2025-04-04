import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Avatar, Button, TextField, Typography, IconButton,
  Select, MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

const ServiceProviderUpdateModal = ({ open, handleClose, worker }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fullName, setFullName] = useState(["", ""])
  const [address, setAddress] = useState(["", ""])
  const [phone, setPhone] = useState("")
  const [services, setServices] = useState([])
  useEffect(() => {
    if (worker && worker.userDetails) {
      setFullName([worker.userDetails.first_name, worker.userDetails.last_name]);
      setAddress([worker.userDetails.address.line1, worker.userDetails.address.postal_code]);
      setPhone(worker.userDetails.phone);
      setServices(worker.services || []);
    }
  }, [worker]);
  if (!worker) return null;

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (workerId) => {
    try {
      const response = await fetch(`https://fixifyaws-backend-new-production.up.railway.app/users/${workerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }
      const result = await response.json();
      console.log(result.message);
      setDeleteDialogOpen(false);
      handleClose();
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };
  const handleServicesChange = (event) => {
    const newServices = event.target.value.split(",").map(service => service.trim());
    setServices(newServices);
  };
  const handleFullNameChange = (e) => {
    const nameParts = e.target.value.split(" ");
    setFullName([nameParts[0], nameParts[1]]);
  };
  const handleAddressChange = (e) => {
    const fullAddress = e.target.value;
    const addressParts = fullAddress.split(" ");
    setAddress([addressParts[0], addressParts[1]]);
  };
  
  const handleSave = async () => {
    const userData = {
      _id: worker._id, // Use worker's _id
      user_id: worker.user_id, // Use worker's user_id
      status: worker.status, // Use worker's current status (assuming 'verified' is default or static)
      services: services, // Use the updated services array from state
      ratings: worker.ratings, // Use worker's ratings
      reviews_count: worker.reviews_count, // Use worker's review count
      userDetails: {
        ...worker.userDetails, // Spread existing userDetails object
        first_name: fullName[0], // Update first name from state
        last_name: fullName[1], // Update last name from state
        phone: phone, // Update phone number from state
        address: {
          ...worker.userDetails.address, // Spread existing address object
          line1: address[0], // Update address line1 from state
          unit_no: "", // You can handle this with state if necessary
          postal_code: address[1], // Update postal code from state
          // Optionally, other fields like province, country, longitude, latitude can be updated if needed
        }
      }
    };
    try {
      const response = await fetch(`https://fixifyaws-backend-new-production.up.railway.app/users/${worker.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      const result = await response.json();
      console.log("User details updated successfully:", result);
      handleClose();
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };


  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Profile
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Avatar Upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ width: 80, height: 80 }} />
              <Box>
                <Button variant="contained" component="label">Upload Photo</Button>
                <Button variant="text">Remove Photo</Button>
              </Box>
            </Box>

            {/* Full Name & Email */}
            <TextField label="Full Name" fullWidth value={fullName.join(" ")} onChange={handleFullNameChange} />

            {/* Company & Position */}
            <TextField label="Phone" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Services Provided" fullWidth value={services} onChange={handleServicesChange} />
            <TextField label="Address" fullWidth value={address.join(" ")} onChange={handleAddressChange} />

            {/* Account Details */}
            <Typography variant="h6">Account Details</Typography>
            <TextField label="Log in email address" fullWidth value={worker.userDetails.email} disabled />
            <TextField label="Password" fullWidth type="password" value="*********" disabled />

            {/* Delete Account */}
            <Typography color="error">
              Deleting your account will remove all access. This action cannot be undone.
            </Typography>
            <Button variant="outlined" color="error" onClick={handleDeleteClick}>
              Delete Account
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions >
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(worker.user_id)}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceProviderUpdateModal;
