import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Tab, Tabs, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0: Customer, 1: Chef
  const [error, setError] = useState(''); // For error handling
  const [userId, setUserId] = useState(null); // For storing userId
  const [name, setUsername] = useState(''); // For storing username (if provided)
  const [openModal, setOpenModal] = useState(false); // To manage modal state
  const navigate = useNavigate(); // For navigation

  // Function to check the role when email is entered
  const checkEmailRole = async (email) => {
    try {
      const roleResponse = await fetch(`http://localhost:8080/auth/check-email?email=${email}`);
      const roleData = await roleResponse.json();

      if (roleResponse.ok) {
        const role = roleData.role;

        if (role === 'ROLE_CHEF') {
          setActiveTab(1); // Set active tab to Chef
        } else if (role === 'ROLE_CUSTOMER') {
          setActiveTab(0); // Set active tab to Customer
        } else {
          setError('Invalid role detected. Please contact an administrator.');
        }
      } else {
        setError(roleData.message || 'Error checking role');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      email,
      password,
      role: activeTab === 1 ? 'chef' : 'customer',
    };

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId); // Store userId for later use
        localStorage.setItem('username', data.name); // Assuming username is returned
        setUserId(data.userId);
        setUsername(data.name); // Set username if available

        toast.success('Login successful!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: 'colored',
        });

        // Show the modal after login success
        setOpenModal(true);

      } else {
        toast.error(data.error || 'Invalid credentials. Please try again.', {
          position: 'top-center',
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: 'colored',
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'colored',
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(''); // Reset error when switching tabs
  };

  const handleModalClose = () => {
    setOpenModal(false);
    // Redirect to Chef Dashboard or Customer Dashboard based on role
    if (activeTab === 1) {
      navigate('/chef-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }} centered>
          <Tab label="Customer" />
          <Tab label="Chef" />
        </Tabs>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>} {/* Display error message */}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value) checkEmailRole(e.target.value); // Check role as soon as email is entered
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            {activeTab === 0 ? 'Customer Login' : 'Chef Login'}
          </Button>
        </form>

        {/* Display the userId on successful login */}
        {userId && (
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            Welcome! Your User ID is: {userId}
          </Typography>
        )}
      </Box>

      {/* Modal for login success */}
      {/* Modal for login success */}
<Dialog
  open={openModal}
  onClose={handleModalClose}
  PaperProps={{
    sx: {
      backgroundColor: '#e3f2fd', // Light blue background
      borderRadius: 3,
      boxShadow: 6,
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: '#1976d2',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      pb: 2,
    }}
  >
    🎉 Login Successful!
  </DialogTitle>

  <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
    <Typography variant="h6" sx={{ color: '#0d47a1' }}>
      Welcome, <strong>{name}</strong>!
    </Typography>
    <Typography variant="subtitle1" sx={{ mt: 1, color: '#424242' }}>
      Your User ID is: <strong>{userId}</strong>
    </Typography>
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
    <Button
      onClick={handleModalClose}
      variant="contained"
      sx={{
        backgroundColor: '#1976d2',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#1565c0',
        },
      }}
    >
      Go to Dashboard
    </Button>
  </DialogActions>
</Dialog>


      <ToastContainer />
    </Container>
  );
};

export default LoginPage;
