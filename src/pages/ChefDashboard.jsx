import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
 InputBase
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";

const ChefDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // or from context
  const chefName = user?.username || "Chef";
  const [userId, setUserId] = useState(user?.id || "");
  const [openModal, setOpenModal] = useState(false);
  const [tempId, setTempId] = useState("");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleConfirm = () => {
    setOpenModal(false);
    setUserId(tempId);
    navigate(`/view-orders/${tempId}`);
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Welcome, {chefName}
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Add Catering */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <AddCircleOutlineIcon sx={{ fontSize: 50, color: "green" }} />
              <Typography variant="h6" mt={2}>
                Add Catering
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
                Create a new catering event with custom menu and pricing.
              </Typography>
              <Button variant="contained" color="success" onClick={() => navigate("/upload-catering")}>
                Add Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* View Orders */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <ListAltIcon sx={{ fontSize: 50, color: "blue" }} />
              <Typography variant="h6" mt={2}>
                View Orders
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
                View and manage all incoming catering orders.
              </Typography>
              <Button variant="contained" color="primary" onClick={handleOpenModal}>
                View Orders
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal to Enter User ID */}
      <Dialog
  open={openModal}
  onClose={() => setOpenModal(false)}
  PaperProps={{
    sx: {
      borderRadius: 4,
      background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
      border: "1px solid #b2ebf2",
      boxShadow: "0 8px 30px rgba(0, 150, 136, 0.25)",
      maxWidth: 420,
      mx: "auto",
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      fontSize: "1.4rem",
      textAlign: "center",
      color: "#004d40",
      px: 3,
      pt: 3,
    }}
  >
    🔐 Enter Your Catering ID
  </DialogTitle>

  <DialogContent sx={{ px: 4, pb: 2 }}>
    <Box
      sx={{
        border: "1px solid #26a69a",
        borderRadius: 2,
        px: 2,
        py: 1,
        mt: 2,
        backgroundColor: "#ffffff",
        transition: "0.2s ease",
        "&:hover": {
          borderColor: "#009688",
        },
        "&:focus-within": {
          borderColor: "#004d40",
        },
      }}
    >
      <InputBase
        fullWidth
        placeholder="e.g., chef123"
        value={tempId}
        onChange={(e) => setTempId(e.target.value)}
        sx={{
          fontSize: "1rem",
          py: 1,
          px: 1,
        }}
      />
    </Box>
  </DialogContent>

  <DialogActions
    sx={{
      justifyContent: "space-between",
      px: 4,
      pb: 3,
    }}
  >
    <Button
      onClick={() => setOpenModal(false)}
      sx={{
        color: "#00796b",
        fontWeight: 500,
        textTransform: "none",
        backgroundColor: "#e0f2f1",
        "&:hover": {
          backgroundColor: "#b2dfdb",
        },
      }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={handleConfirm}
      disabled={!tempId}
      sx={{
        textTransform: "none",
        background: "linear-gradient(to right,rgb(190, 247, 240),rgb(49, 157, 139))",
        color: "#fff",
        fontWeight: 600,
        "&:hover": {
          background: "linear-gradient(to right, #004d40,rgb(6, 81, 73))",
        },
      }}
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>



    </Box>
  );
};

export default ChefDashboard;
