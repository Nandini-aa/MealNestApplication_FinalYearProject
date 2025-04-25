import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Paper, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "ROLE_CHEF", // Default role
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2, width: "100%", textAlign: "center" }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Register
        </Typography>

        <form onSubmit={handleRegister}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="ROLE_CHEF">Chef</MenuItem>
                <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              Register
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
