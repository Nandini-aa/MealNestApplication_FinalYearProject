import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import axios from "axios";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // if using token-based auth
      const res = await axios.get("http://localhost:8080/api/orders/by-chef/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/approve/${orderId}`);
      fetchOrders(); // refresh list
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  return (
    <Box p={4}>
    <Typography variant="h5" gutterBottom>Orders Received</Typography>
    <Grid container spacing={2}>
      {orders.map((order) => (
        <Grid item xs={12} key={order.orderId}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography><strong>Name:</strong> {order.name}</Typography>
            <Typography><strong>Email:</strong> {order.email}</Typography>
            <Typography><strong>Phone:</strong> {order.phone}</Typography>
            <Typography><strong>Address:</strong> {order.address}</Typography>
            <Typography><strong>Items:</strong> {order.selectedMenuItems.map(item => item.menuName).join(", ")}</Typography>
            <Typography><strong>Status:</strong> {order.status}</Typography>
            {order.status === "Pending" && (
              <Button variant="contained" color="primary" onClick={() => handleApprove(order.orderId)}>
                Approve
              </Button>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
  );
};

export default ViewOrders;
