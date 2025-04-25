import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  AppBar,
  IconButton,Toolbar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const ChefOrdersPage = () => {
  const { cateringId } = useParams();


  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/orders/by-chef/${cateringId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log("Fetched orders:", data);

        // Ensure it's always an array
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data) {
          setOrders([data]); // wrap single object in an array
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [cateringId]);

  const handleApprove = async (orderId) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/approve`);
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: "approved" } : order
        )
      );
    } catch (error) {
      console.error("Approval failed", error);
    }
  };
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 4 }}>

<AppBar position="static" color="primary">
           <Toolbar>
             <Typography variant="h6" sx={{ flexGrow: 1 }}>
               MealNest
             </Typography>
             <IconButton color="inherit" onClick={() => navigate("/")}>
               <div fontSize="large" />Logout
             </IconButton>
           </Toolbar>
         </AppBar>
      <Typography variant="h4" gutterBottom textAlign="center">
        Orders for Chef {cateringId}
      </Typography>

      <Grid container spacing={3}>
        {Array.isArray(orders) && orders.length > 0 ? (
  orders.map((order) => (
    <Grid item xs={12} md={6} key={order.orderId}>
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6">
            Customer: {order.name || "N/A"}
          </Typography>
          <Typography><strong>Email:</strong> {order.email || "N/A"}</Typography>
          <Typography><strong>Phone:</strong> {order.phone || "N/A"}</Typography>
    <Typography><strong>Address:</strong> {order.address || "N/A"}</Typography>
    <Typography><strong>Time:</strong> {order.time || "N/A"}</Typography>
    <Typography><strong>Payment Method:</strong> {order.paymentMethod || "N/A"}</Typography>
    <Typography><strong>Instructions:</strong> {order.instructions || "None"}</Typography>
    <Typography><strong>Extras:</strong> {order.extras?.join(", ") || "None"}</Typography>
    <Typography><strong>Number of People:</strong> {order.numberofpeople || "N/A"}</Typography>
          <Typography>Date: {order.date || order.eventDate}</Typography>
          <Typography>
            Menu:{" "}
            {order.selectedMenuItems
              ? order.selectedMenuItems.map((item) => item.menuName).join(", ")
              : "N/A"}
          </Typography>

          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <Chip
              label={order.status}
              color={order.status === "approved" ? "success" : "warning"}
            />
            {order.status === "pending" && (
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove(order.orderId)}
              >
                Approve
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))
) : (
  <Grid item xs={12}>
    <Typography>No orders found for this chef.</Typography>
  </Grid>
)}
      </Grid>
    </Box>
  );
};

export default ChefOrdersPage;
