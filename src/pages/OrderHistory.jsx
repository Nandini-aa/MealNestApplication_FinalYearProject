import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Paper, Alert, Chip, Grid, Box, Divider, } from "@mui/material";

const OrderHistory = () => {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const handleFetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/orders/customer/${email}`);
      setOrders(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch order history.");
      setOrders([]);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "30px" }}>
    <Paper elevation={4} style={{ padding: "25px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Order History
      </Typography>

      <Box mb={2}>
        <TextField
          label="Enter User Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      <Button variant="contained" color="primary" fullWidth onClick={handleFetchOrders}>
        Fetch Order History
      </Button>

      {error && <Alert severity="error" style={{ marginTop: "15px" }}>{error}</Alert>}

      {orders.map((order, index) => (
        <Paper key={index} elevation={2} style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Order ID: {order.orderId}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Event:</strong> {order.eventName}</Typography>
              <Typography><strong>Date & Time:</strong> {order.date} at {order.time}</Typography>
              <Typography><strong>Status:</strong> {order.status}</Typography>
              <Typography><strong>Payment Method:</strong> {order.paymentMethod}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Name:</strong> {order.name}</Typography>
              <Typography><strong>Phone:</strong> {order.phone}</Typography>
              <Typography><strong>Email:</strong> {order.email}</Typography>
              <Typography><strong>Address:</strong> {order.address}</Typography>
            </Grid>
          </Grid>

          <Typography style={{ marginTop: "10px" }}><strong>Instructions:</strong> {order.instructions}</Typography>
          <Typography><strong>No. of People:</strong> {order.numberofpeople}</Typography>

          <Typography style={{ marginTop: "10px" }}><strong>Extras:</strong></Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {order.extras?.map((extra, i) => (
              <Chip key={i} label={extra} color="secondary" />
            ))}
          </Box>

          <Typography variant="subtitle1" style={{ marginTop: "15px" }}>
            <strong>Selected Menu Items:</strong>
          </Typography>
          {order.selectedMenuItems?.map((item, i) => (
            <Box key={i} display="flex" alignItems="center" gap={2} mt={1}>
              <img src={item.imageUrl} alt={item.menuName} style={{ width: 60, height: 60, borderRadius: "10px" }} />
              <Typography>{item.menuName} - ₹{item.price}</Typography>
            </Box>
          ))}

          <Divider style={{ margin: "15px 0" }} />
          <Typography><strong>Total Price:</strong> ₹{order.totalPrice}</Typography>
          <Typography><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</Typography>
        </Paper>
      ))}
    </Paper>
  </Container>
  );
};

export default OrderHistory;
