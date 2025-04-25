import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MealNest
          </Typography>
          <IconButton color="inherit" onClick={() => navigate("/admin/login")}>
            <AdminPanelSettingsIcon fontSize="large" /> ADMIN
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Two-column layout */}
      <Grid container sx={{ minHeight: "calc(100vh - 70px)" }}>
        {/* Left side: Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundImage: `url("https://plus.unsplash.com/premium_photo-1673203734665-0a534c043b7f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: { xs: "none", md: "block" },
          }}
        />

        {/* Right side: Content */}
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Container maxWidth="sm">
            <Paper elevation={6} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                Welcome to MealNest
              </Typography>
              <Typography variant="h6" color="textSecondary" paragraph>
                Register or Login to continue
              </Typography>

              {/* Buttons Section */}
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
