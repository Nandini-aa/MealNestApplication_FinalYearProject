import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Edit, ExitToApp, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [editUser, setEditUser] = useState(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchUsers();
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", { email, password });
      const receivedToken = response.data.token;
      localStorage.setItem("token", receivedToken);
    
      setToken(receivedToken);
      setIsLoggedIn(true);
     
      toast.success("Login successful");
      fetchUsers();
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }

  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/getallusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/auth/updateuser/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setEditUser(null);
      toast.success("User updated successfully");
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/auth/deleteuser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data || "Error deleting user");
    }
  };
  

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsers([]);
    setEmail("");
    setPassword("");
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container maxWidth="md">
      {!isLoggedIn ? (
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h4" align="center" gutterBottom>Admin Login</Typography>
          <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin} style={{ marginTop: "10px" }}>Login</Button>
          {error && <Alert severity="error" style={{ marginTop: "10px" }}>{error}</Alert>}
        </Paper>
      ) : (
        <>
          <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginTop: "20px", marginBottom: "20px" }} startIcon={<ExitToApp />}>Logout</Button>
          <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
            <Typography variant="h5" align="center" gutterBottom>Users</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.active ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => setEditUser(user)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(user.id)}>
          <Delete />
        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {editUser && (
        <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField label="Username" variant="outlined" fullWidth margin="normal" value={editUser.username} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
            <TextField label="Email" variant="outlined" fullWidth margin="normal" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)} color="secondary">Cancel</Button>
            <Button onClick={handleEdit} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AdminLogin;
